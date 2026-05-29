import Link from "next/link";
import { prisma } from "@/lib/prisma";

// SVG chart constants
const SVG_W  = 800;
const SVG_H  = 280;
const PAD_L  = 12;
const PAD_R  = 12;
const PAD_T  = 16;
const PAD_B  = 32;
const PLOT_W = SVG_W - PAD_L - PAD_R; // 776
const PLOT_H = SVG_H - PAD_T - PAD_B; // 232

const KIND_ORDER = ["electricity", "gas", "water"] as const;

const KIND_COLOR: Record<(typeof KIND_ORDER)[number], string> = {
  electricity: "#3b82f6",
  gas:         "#f97316",
  water:       "#14b8a6",
};

type ChartPoint = { readAt: Date; kind: string; value: number };

function toPoints(
  readings: ChartPoint[],
  minTime: number,
  timeRange: number,
  minVal: number,
  valRange: number
): string {
  return readings
    .map((r) => {
      const x =
        timeRange === 0
          ? PAD_L + PLOT_W / 2
          : PAD_L + ((r.readAt.getTime() - minTime) / timeRange) * PLOT_W;
      const y =
        valRange === 0
          ? PAD_T + PLOT_H / 2
          : PAD_T + PLOT_H - ((r.value - minVal) / valRange) * PLOT_H;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function xAxisTicks(
  minTime: number,
  maxTime: number,
  count: number
): { label: string; x: number }[] {
  if (minTime === maxTime) return [];
  return Array.from({ length: count }, (_, i) => {
    const t = minTime + (i / (count - 1)) * (maxTime - minTime);
    const x = PAD_L + ((t - minTime) / (maxTime - minTime)) * PLOT_W;
    const label = new Date(t).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    });
    return { label, x };
  });
}

function MeterChart({ readings }: { readings: ChartPoint[] }) {
  if (readings.length === 0) return null;

  const byKind = new Map<string, ChartPoint[]>();
  for (const r of readings) {
    if (!byKind.has(r.kind)) byKind.set(r.kind, []);
    byKind.get(r.kind)!.push(r);
  }

  let minTime = Infinity;
  let maxTime = -Infinity;
  for (const r of readings) {
    const t = r.readAt.getTime();
    if (t < minTime) minTime = t;
    if (t > maxTime) maxTime = t;
  }
  const timeRange = maxTime - minTime;

  const series = KIND_ORDER.flatMap((kind) => {
    const pts = byKind.get(kind);
    if (!pts || pts.length === 0) return [];
    const values   = pts.map((p) => p.value);
    const minVal   = values.reduce((a, b) => (a < b ? a : b), Infinity);
    const maxVal   = values.reduce((a, b) => (a > b ? a : b), -Infinity);
    const valRange = maxVal - minVal;
    return [
      {
        kind,
        color:  KIND_COLOR[kind],
        points: toPoints(pts, minTime, timeRange, minVal, valRange),
      },
    ];
  });

  if (series.length === 0) return null;

  const ticks = xAxisTicks(minTime, maxTime, 5);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        aria-label="Meter readings over time"
        role="img"
      >
        <title>Meter readings over time</title>
        <line
          x1={PAD_L} y1={PAD_T + PLOT_H}
          x2={PAD_L + PLOT_W} y2={PAD_T + PLOT_H}
          stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"
        />
        <line
          x1={PAD_L} y1={PAD_T}
          x2={PAD_L} y2={PAD_T + PLOT_H}
          stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"
        />
        {ticks.map(({ label, x }, i) => (
          <text
            key={i}
            x={x} y={PAD_T + PLOT_H + 16}
            textAnchor="middle" fontSize="11"
            fill="currentColor" fillOpacity="0.5"
          >
            {label}
          </text>
        ))}
        {series.map(({ kind, color, points }) => (
          <polyline
            key={kind}
            points={points}
            fill="none" stroke={color} strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round"
          />
        ))}
        {series.map(({ kind, color }, i) => {
          const legendX = SVG_W - PAD_R - 120;
          const legendY = PAD_T + i * 20;
          return (
            <g key={kind}>
              <line
                x1={legendX} y1={legendY + 4}
                x2={legendX + 16} y2={legendY + 4}
                stroke={color} strokeWidth="2"
              />
              <text
                x={legendX + 20} y={legendY + 8}
                fontSize="12" fill="currentColor" fillOpacity="0.8"
              >
                {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default async function Home() {
  const [chartReadings, tableReadings] = await Promise.all([
    prisma.meterReading.findMany({
      orderBy: { readAt: "asc" },
      take: 500,
      select: { readAt: true, kind: true, value: true },
    }),
    prisma.meterReading.findMany({
      orderBy: { readAt: "desc" },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Claude Code workshop starter
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Next.js + Prisma + SQLite. See{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
            README.md
          </code>{" "}
          for the project tour and Blok 4 tasks.
        </p>
        <p className="mt-2">
          <Link
            href="/shop"
            className="text-sm font-medium underline underline-offset-4"
          >
            View the shop &rarr;
          </Link>
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Meter readings over time</h2>
        {chartReadings.length > 0 ? (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <MeterChart readings={chartReadings} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            No readings yet. Run{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
              npx prisma db seed
            </code>
            .
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Recent meter readings</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-2 font-medium">Kind</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Unit</th>
                <th className="px-4 py-2 font-medium">Read at</th>
                <th className="px-4 py-2 font-medium">User</th>
              </tr>
            </thead>
            <tbody>
              {tableReadings.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="px-4 py-2 capitalize">{r.kind}</td>
                  <td className="px-4 py-2 font-mono">{r.value}</td>
                  <td className="px-4 py-2">{r.unit}</td>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {r.readAt.toISOString()}
                  </td>
                  <td className="px-4 py-2">{r.user.name ?? "Anonymous"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tableReadings.length === 0 && (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            No readings yet. Run{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
              npx prisma db seed
            </code>
            .
          </p>
        )}
      </section>
    </main>
  );
}
