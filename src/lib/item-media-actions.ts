"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContentEditor } from "@/lib/admin-auth";
import { languages, type Language } from "@/lib/i18n";
import { writeAuditLog } from "@/lib/audit-log";

function localizedField(formData: FormData, field: string) {
  return languages.reduce(
    (acc, lang) => {
      acc[lang] = String(formData.get(`${field}_${lang}`) ?? "").trim();
      return acc;
    },
    {} as Record<Language, string>
  );
}

export async function setItemPrimaryMediaAction(formData: FormData) {
  const session = await requireContentEditor();
  const itemId = z.coerce.bigint().parse(formData.get("itemId"));
  const mediaId = z.coerce.bigint().parse(formData.get("mediaId"));
  const altText = localizedField(formData, "altText");
  const [item, media] = await Promise.all([
    prisma.item.findUnique({ where: { id: itemId }, include: { images: true } }),
    prisma.media.findUnique({ where: { id: mediaId } })
  ]);

  if (!item || !media) {
    throw new Error("藏品或媒体不存在。");
  }

  await prisma.$transaction([
    prisma.itemImage.updateMany({ where: { itemId }, data: { isPrimary: false } }),
    prisma.itemImage.create({
      data: {
        itemId,
        mediaId,
        url: media.url,
        urlWebp: media.urlWebp,
        urlThumb: media.urlThumb,
        altText,
        isPrimary: true,
        sortOrder: 0
      }
    })
  ]);

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "item_primary_media_updated",
    targetType: "item",
    targetId: itemId.toString(),
    beforeData: item.images,
    afterData: { mediaId: mediaId.toString(), altText }
  });

  revalidatePath("/admin/items");
  for (const lang of languages) {
    revalidatePath(`/${lang}/collection`);
    revalidatePath(`/${lang}/item/${item.slug}`);
  }
}
