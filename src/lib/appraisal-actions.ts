"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import { RequestStatus } from "@prisma/client";
import { requireContentEditor } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { getLanguage, languages } from "@/lib/i18n";
import { adminNotificationEmail, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const maxUploadBytes = 5 * 1024 * 1024;
const maxFiles = 5;
const uploadDir = path.join(process.cwd(), "public", "uploads", "appraisals");
const publicUploadBase = "/uploads/appraisals";
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/heic", "image/heif"]);

const updateAppraisalSchema = z.object({
  id: z.coerce.bigint(),
  status: z.nativeEnum(RequestStatus),
  adminNote: z.string().trim().max(4000).optional()
});

const submitAppraisalSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  type: z.string().trim().min(1).max(30),
  region: z.string().trim().max(100).optional(),
  itemCategory: z.string().trim().max(100).optional(),
  description: z.string().trim().max(6000).optional(),
  preferredDate: z.string().trim().optional(),
  lang: z.enum(languages),
  privacy: z.literal("on")
});

export type AppraisalSubmitState = {
  ok: boolean;
  requestNo?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function clientIp(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function extensionFor(file: File) {
  if (/\.heic$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif") {
    return "heic";
  }
  if (file.type === "image/png" || /\.png$/i.test(file.name)) {
    return "png";
  }
  return "jpg";
}

function validateImageFile(file: File) {
  const extensionOk = /\.(jpe?g|png|heic|heif)$/i.test(file.name);
  if (file.size > maxUploadBytes) {
    throw new Error("Each image must be 5MB or smaller.");
  }
  if (!allowedImageTypes.has(file.type) && !extensionOk) {
    throw new Error("Only JPG, PNG, HEIC, and HEIF images are supported.");
  }
}

async function saveAppraisalImages(files: File[], requestNo: string) {
  await mkdir(uploadDir, { recursive: true });
  const urls: string[] = [];

  for (const file of files) {
    validateImageFile(file);
    const filename = `${requestNo.toLowerCase()}-${randomUUID().slice(0, 8)}.${extensionFor(file)}`;
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    urls.push(`${publicUploadBase}/${filename}`);
  }

  return urls;
}

function requestNumber() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  return `APP-${stamp}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

function parsePreferredDate(value?: string) {
  if (!value) {
    return null;
  }
  const date = new Date(`${value}T00:00:00+09:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function submitAppraisalAction(_state: AppraisalSubmitState, formData: FormData): Promise<AppraisalSubmitState> {
  const parsed = submitAppraisalSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    type: formData.get("type"),
    region: formData.get("region"),
    itemCategory: formData.get("itemCategory"),
    description: formData.get("description"),
    preferredDate: formData.get("preferredDate"),
    lang: getLanguage(String(formData.get("lang") ?? "ja")),
    privacy: formData.get("privacy")
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const files = formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
  if (files.length > maxFiles) {
    return { ok: false, message: "画像は最大5枚までです。" };
  }

  try {
    for (const file of files) {
      validateImageFile(file);
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Invalid image upload." };
  }

  const headerList = await headers();
  const requestNo = requestNumber();
  const images = await saveAppraisalImages(files, requestNo);
  const saved = await prisma.appraisalRequest.create({
    data: {
      requestNo,
      type: parsed.data.type,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      region: parsed.data.region || null,
      itemCategory: parsed.data.itemCategory || null,
      description: parsed.data.description || null,
      preferredDate: parsePreferredDate(parsed.data.preferredDate),
      images,
      lang: parsed.data.lang,
      ipAddress: clientIp(headerList.get("x-forwarded-for")) ?? clientIp(headerList.get("x-real-ip")),
      userAgent: headerList.get("user-agent")
    }
  });
  const adminEmail = await adminNotificationEmail();
  const adminBody = [
    `Request No: ${saved.requestNo}`,
    `Type: ${saved.type}`,
    `Name: ${saved.name}`,
    `Email: ${saved.email}`,
    `Phone: ${saved.phone ?? "-"}`,
    `Region: ${saved.region ?? "-"}`,
    `Category: ${saved.itemCategory ?? "-"}`,
    `Preferred Date: ${saved.preferredDate?.toISOString().slice(0, 10) ?? "-"}`,
    `Images: ${saved.images.join(", ") || "-"}`,
    "",
    saved.description ?? ""
  ].join("\n");

  const [adminMailResult, userMailResult] = await Promise.all([
    adminEmail ? sendMail({ to: adminEmail, subject: `Appraisal request ${saved.requestNo}`, text: adminBody, replyTo: saved.email }) : Promise.resolve(),
    sendMail({
      to: saved.email,
      subject: saved.lang === "en" ? `Appraisal request received: ${saved.requestNo}` : saved.lang === "zh" ? `鉴定申请已收到：${saved.requestNo}` : `鑑定申込を受け付けました：${saved.requestNo}`,
      text:
        saved.lang === "en"
          ? `Dear ${saved.name},\n\nThank you for your appraisal request. Your request number is ${saved.requestNo}.\n\nGyokurinken Co., Ltd.`
          : saved.lang === "zh"
            ? `${saved.name} 您好：\n\n感谢您提交鉴定申请。申请编号：${saved.requestNo}。\n\n玉林軒株式会社`
            : `${saved.name} 様\n\n鑑定申込を受け付けました。申込番号：${saved.requestNo}。\n\n玉林軒株式会社`
    })
  ]);

  await writeAuditLog({
    action: "appraisal_request_created",
    targetType: "appraisal_request",
    targetId: saved.id.toString(),
    afterData: {
      requestNo: saved.requestNo,
      type: saved.type,
      lang: saved.lang,
      imageCount: saved.images.length,
      adminMail: adminEmail ? adminMailResult : { ok: false, provider: "disabled", error: "Admin notification email is not configured." },
      userMail: userMailResult
    },
    ipAddress: saved.ipAddress
  });

  revalidatePath("/admin");
  revalidatePath("/admin/appraisals");
  redirect(`/${saved.lang}/appraisal/form/thanks?requestNo=${encodeURIComponent(saved.requestNo)}`);
}

export async function updateAppraisalAction(formData: FormData) {
  const session = await requireContentEditor();
  const values = updateAppraisalSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote")
  });
  const beforeData = await prisma.appraisalRequest.findUnique({ where: { id: values.id } });

  if (!beforeData) {
    throw new Error("鉴定申请不存在。");
  }

  const saved = await prisma.appraisalRequest.update({
    where: { id: values.id },
    data: {
      status: values.status,
      adminNote: values.adminNote || null
    }
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "appraisal_request_updated",
    targetType: "appraisal_request",
    targetId: saved.id.toString(),
    beforeData,
    afterData: saved
  });

  revalidatePath("/admin/appraisals");
}
