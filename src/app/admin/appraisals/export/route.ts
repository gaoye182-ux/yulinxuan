import { NextResponse } from "next/server";
import type { Prisma, RequestStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statusValues = new Set(["unread", "in_progress", "replied", "completed", "rejected", "archived"]);

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

function buildWhere(params: URLSearchParams): Prisma.AppraisalRequestWhereInput {
  const q = params.get("q")?.trim();
  const status = params.get("status")?.trim();
  const type = params.get("type")?.trim();
  const lang = params.get("lang")?.trim();
  const from = params.get("from")?.trim();
  const to = params.get("to")?.trim();

  return {
    ...(status && statusValues.has(status) ? { status: status as RequestStatus } : {}),
    ...(type ? { type } : {}),
    ...(lang ? { lang } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(`${from}T00:00:00+09:00`) } : {}),
            ...(to ? { lte: new Date(`${to}T23:59:59+09:00`) } : {})
          }
        }
      : {}),
    ...(q
      ? {
          OR: [
            { requestNo: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { region: { contains: q, mode: "insensitive" } },
            { itemCategory: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };
}

export async function GET(request: Request) {
  await requireAdmin();
  const params = new URL(request.url).searchParams;
  const rows = await prisma.appraisalRequest.findMany({
    where: buildWhere(params),
    orderBy: { createdAt: "desc" },
    take: 2000
  });
  const header = [
    "request_no",
    "status",
    "type",
    "name",
    "email",
    "phone",
    "region",
    "item_category",
    "preferred_date",
    "description",
    "images",
    "admin_note",
    "lang",
    "created_at",
    "updated_at"
  ];
  const csv = [
    header.map(csvCell).join(","),
    ...rows.map((row) =>
      [
        row.requestNo,
        row.status,
        row.type,
        row.name,
        row.email,
        row.phone,
        row.region,
        row.itemCategory,
        row.preferredDate,
        row.description,
        row.images.join(" "),
        row.adminNote,
        row.lang,
        row.createdAt,
        row.updatedAt
      ].map(csvCell).join(",")
    )
  ].join("\r\n");

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="appraisal-requests-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
