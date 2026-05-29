"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RequestStatus } from "@prisma/client";
import { requireContentEditor } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { getLanguage, languages } from "@/lib/i18n";
import { adminNotificationEmail, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  category: z.string().trim().max(50).optional(),
  message: z.string().trim().min(1).max(6000),
  lang: z.enum(languages),
  privacy: z.literal("on")
});

const updateContactSchema = z.object({
  id: z.coerce.bigint(),
  status: z.nativeEnum(RequestStatus),
  adminNote: z.string().trim().max(4000).optional(),
  replyNote: z.string().trim().max(4000).optional()
});

function clientIp(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

export type ContactSubmitState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function submitContactAction(_state: ContactSubmitState, formData: FormData): Promise<ContactSubmitState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    category: formData.get("category"),
    message: formData.get("message"),
    lang: getLanguage(String(formData.get("lang") ?? "ja")),
    privacy: formData.get("privacy")
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const headerList = await headers();
  const saved = await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      category: parsed.data.category || null,
      message: parsed.data.message,
      lang: parsed.data.lang,
      ipAddress: clientIp(headerList.get("x-forwarded-for")) ?? clientIp(headerList.get("x-real-ip")),
      userAgent: headerList.get("user-agent")
    }
  });
  const adminEmail = await adminNotificationEmail();
  const subject = `Contact inquiry: ${saved.name}`;
  const body = [
    `Name: ${saved.name}`,
    `Email: ${saved.email}`,
    `Phone: ${saved.phone ?? "-"}`,
    `Category: ${saved.category ?? "-"}`,
    `Language: ${saved.lang}`,
    "",
    saved.message
  ].join("\n");

  const [adminMailResult, userMailResult] = await Promise.all([
    adminEmail ? sendMail({ to: adminEmail, subject, text: body, replyTo: saved.email }) : Promise.resolve(),
    sendMail({
      to: saved.email,
      subject: saved.lang === "en" ? "We received your inquiry" : saved.lang === "zh" ? "我们已收到您的咨询" : "お問い合わせを受け付けました",
      text:
        saved.lang === "en"
          ? `Dear ${saved.name},\n\nThank you for contacting Gyokurinken. We received your inquiry and will review it.\n\nGyokurinken Co., Ltd.`
          : saved.lang === "zh"
            ? `${saved.name} 您好：\n\n感谢您联系玉林軒。我们已收到您的咨询，将确认内容。\n\n玉林軒株式会社`
            : `${saved.name} 様\n\n玉林軒株式会社へお問い合わせいただき、誠にありがとうございます。内容を確認のうえ、必要に応じてご連絡いたします。\n\n玉林軒株式会社`
    })
  ]);

  await writeAuditLog({
    action: "contact_message_created",
    targetType: "contact_message",
    targetId: saved.id.toString(),
    afterData: {
      lang: saved.lang,
      category: saved.category,
      adminMail: adminEmail ? adminMailResult : { ok: false, provider: "disabled", error: "Admin notification email is not configured." },
      userMail: userMailResult
    },
    ipAddress: saved.ipAddress
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  redirect(`/${saved.lang}/contact/thanks`);
}

export async function updateContactAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = updateContactSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote"),
    replyNote: formData.get("replyNote")
  });
  const beforeData = await prisma.contactMessage.findUnique({ where: { id: values.id } });

  if (!beforeData) {
    throw new Error("联系留言不存在。");
  }

  const saved = await prisma.contactMessage.update({
    where: { id: values.id },
    data: {
      status: values.status,
      adminNote: values.adminNote || null,
      replyNote: values.replyNote || null
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "contact_message_updated",
    targetType: "contact_message",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
}
