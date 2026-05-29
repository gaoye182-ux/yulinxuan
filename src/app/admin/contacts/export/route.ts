import { NextResponse } from "next/server";
import type { Prisma, RequestStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statusValues = new Set(["unread", "in_progress", "replied", "completed", "archived"]);

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

function buildWhere(params: URLSearchParams): Prisma.ContactMessageWhereInput {
  const q = params.get("q")?.trim();
  const status = params.get("status")?.trim();
  const category = params.get("category")?.trim();
  const lang = params.get("lang")?.trim();

  return {
    ...(status && statusValues.has(status) ? { status: status as RequestStatus } : {}),
    ...(category ? { category } : {}),
    ...(lang ? { lang } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
            { adminNote: { contains: q, mode: "insensitive" } },
            { replyNote: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };
}

export async function GET(request: Request) {
  await requireAdmin();
  const params = new URL(request.url).searchParams;
  const rows = await prisma.contactMessage.findMany({
    where: buildWhere(params),
    orderBy: { createdAt: "desc" },
    take: 2000
  });
  const header = ["id", "status", "category", "name", "email", "phone", "message", "admin_note", "reply_note", "lang", "ip_address", "created_at", "updated_at"];
  const csv = [
    header.map(csvCell).join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.status,
        row.category,
        row.name,
        row.email,
        row.phone,
        row.message,
        row.adminNote,
        row.replyNote,
        row.lang,
        row.ipAddress,
        row.createdAt,
        row.updatedAt
      ].map(csvCell).join(",")
    )
  ].join("\r\n");

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contact-messages-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
