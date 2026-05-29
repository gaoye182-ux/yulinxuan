"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireContentEditor } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { languages, type Language } from "@/lib/i18n";
import { pageBlockDefinitions, parseLocalizedJson, setPath } from "@/lib/page-blocks";
import { prisma } from "@/lib/prisma";

const pageBlockSchema = z.object({
  pageKey: z.string().min(1).max(100),
  blockKey: z.string().min(1).max(100),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
  imagePath: z.preprocess((value) => value ?? undefined, z.string().trim().max(120).optional()),
  imageUrl: z.preprocess((value) => value ?? undefined, z.string().trim().max(2048).optional())
});

function localizedJsonField(formData: FormData) {
  return languages.reduce(
    (acc, lang) => {
      acc[lang] = String(formData.get(`content_${lang}`) ?? "");
      return acc;
    },
    {} as Record<Language, string>
  );
}

function refreshPagePaths(pageKey: string) {
  revalidatePath("/admin/pages");

  if (pageKey === "home") {
    for (const lang of languages) {
      revalidatePath(`/${lang}`);
    }
    return;
  }

  for (const lang of languages) {
    revalidatePath(`/${lang}/${pageKey}`);
  }
}

export async function savePageBlockAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = pageBlockSchema.parse({
    pageKey: formData.get("pageKey"),
    blockKey: formData.get("blockKey"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    imagePath: formData.get("imagePath"),
    imageUrl: formData.get("imageUrl")
  });
  const definition = pageBlockDefinitions.find(
    (item) => item.pageKey === values.pageKey && item.blockKey === values.blockKey
  );

  if (!definition) {
    throw new Error("Unknown page block.");
  }

  const beforeData = await prisma.pageBlock.findUnique({
    where: { pageKey_blockKey: { pageKey: values.pageKey, blockKey: values.blockKey } }
  });

  const content = parseLocalizedJson(localizedJsonField(formData));
  if (values.imagePath && values.imageUrl) {
    for (const lang of languages) {
      content[lang] = setPath(content[lang], values.imagePath, values.imageUrl);
    }
  }

  const saved = await prisma.pageBlock.upsert({
    where: { pageKey_blockKey: { pageKey: values.pageKey, blockKey: values.blockKey } },
    create: {
      pageKey: values.pageKey,
      blockKey: values.blockKey,
      content: content as Prisma.InputJsonValue,
      sortOrder: values.sortOrder,
      isActive: values.isActive
    },
    update: {
      content: content as Prisma.InputJsonValue,
      sortOrder: values.sortOrder,
      isActive: values.isActive
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: beforeData ? "page_block_updated" : "page_block_created",
    targetType: "page_block",
    targetId: `${values.pageKey}:${values.blockKey}`,
    beforeData,
    afterData: saved
  });

  refreshPagePaths(values.pageKey);
  redirect(`/admin/pages?block=${values.pageKey}:${values.blockKey}`);
}
