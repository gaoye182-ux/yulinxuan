"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireContentEditor } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { languages, type Language } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: z.string().trim().optional(),
  coverMediaId: z.string().trim().optional(),
  isActive: z.boolean(),
  showOnHome: z.boolean(),
  sortOrder: z.coerce.number().int(),
  name: z.record(z.enum(languages), z.string().trim().min(1)),
  description: z.record(z.enum(languages), z.string().trim().optional())
});

function localizedField(formData: FormData, field: string) {
  return languages.reduce(
    (acc, lang) => {
      acc[lang] = String(formData.get(`${field}_${lang}`) ?? "").trim();
      return acc;
    },
    {} as Record<Language, string>
  );
}

function parseCategoryForm(formData: FormData) {
  return categorySchema.parse({
    id: formData.get("id"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId"),
    coverMediaId: formData.get("coverMediaId"),
    isActive: formData.get("isActive") === "on",
    showOnHome: formData.get("showOnHome") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    name: localizedField(formData, "name"),
    description: localizedField(formData, "description")
  });
}

function refreshCategoryPaths(slug: string) {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/items");

  for (const lang of languages) {
    revalidatePath(`/${lang}`);
    revalidatePath(`/${lang}/collection`);
    revalidatePath(`/${lang}/collection/${slug}`);
    revalidatePath(`/${lang}/new-arrivals`);
  }
}

export async function saveCategoryAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = parseCategoryForm(formData);
  const id = values.id ? BigInt(values.id) : null;
  const parentId = values.parentId ? BigInt(values.parentId) : null;
  const coverMediaId = values.coverMediaId ? BigInt(values.coverMediaId) : null;

  if (id && parentId && id === parentId) {
    throw new Error("分类不能选择自己作为父级。");
  }

  const beforeData = id
    ? await prisma.category.findUnique({ where: { id }, include: { coverMedia: true } })
    : null;
  const saved = id
    ? await prisma.category.update({
        where: { id },
        data: {
          slug: values.slug,
          name: values.name,
          description: values.description,
          parentId,
          coverMediaId,
          isActive: values.isActive,
          showOnHome: values.showOnHome,
          sortOrder: values.sortOrder
        }
      })
    : await prisma.category.create({
        data: {
          slug: values.slug,
          name: values.name,
          description: values.description,
          parentId,
          coverMediaId,
          isActive: values.isActive,
          showOnHome: values.showOnHome,
          sortOrder: values.sortOrder
        }
      });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: beforeData ? "category_updated" : "category_created",
    targetType: "category",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  refreshCategoryPaths(saved.slug);
  redirect("/admin/categories");
}

export async function disableCategoryAction(formData: FormData) {
  const session = await requireContentEditor();
  const id = z.coerce.bigint().parse(formData.get("id"));
  const beforeData = await prisma.category.findUnique({ where: { id } });

  if (!beforeData) {
    throw new Error("分类不存在。");
  }

  const saved = await prisma.category.update({
    where: { id },
    data: { isActive: false, showOnHome: false }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "category_disabled",
    targetType: "category",
    targetId: id.toString(),
    beforeData,
    afterData: saved
  });

  refreshCategoryPaths(beforeData.slug);
  redirect("/admin/categories");
}
