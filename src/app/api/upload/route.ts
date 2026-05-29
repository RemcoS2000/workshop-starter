import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RowSchema = z.object({
  read_at: z
    .string()
    .min(1)
    .refine((s) => !isNaN(new Date(s).getTime()), { message: "Invalid date" }),
  kind: z.enum(["electricity", "gas", "water"]),
  value: z
    .string()
    .min(1, "Value is required")
    .transform((v) => {
      const n = Number(v);
      if (!isFinite(n)) throw new Error("Invalid number");
      return n;
    }),
  unit: z.enum(["kWh", "m3"]),
});

type ParsedRow = z.infer<typeof RowSchema>;

export async function POST(request: Request): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  if (lines.length < 2) {
    return Response.json({ error: "CSV has no data rows" }, { status: 400 });
  }

  const dataLines = lines.slice(1); // skip header
  const rows: ParsedRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const cols = dataLines[i].split(",");
    if (cols.length !== 4) {
      return Response.json(
        { error: `Row ${i + 2}: expected 4 columns, got ${cols.length}` },
        { status: 400 }
      );
    }
    const result = RowSchema.safeParse({
      read_at: cols[0].trim(),
      kind: cols[1].trim(),
      value: cols[2].trim(),
      unit: cols[3].trim(),
    });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Validation error";
      return Response.json(
        { error: `Row ${i + 2}: ${msg}` },
        { status: 400 }
      );
    }
    rows.push(result.data);
  }

  const user = await prisma.user.findUnique({
    where: { email: "demo@homewizard.local" },
    select: { id: true },
  });
  if (!user) {
    return Response.json(
      { error: "Demo user not found. Run npx prisma db seed first." },
      { status: 404 }
    );
  }

  const { count } = await prisma.meterReading.createMany({
    data: rows.map((row) => ({
      readAt: new Date(row.read_at),
      kind: row.kind,
      value: row.value,
      unit: row.unit,
      userId: user.id,
    })),
  });

  return Response.json({ inserted: count });
}
