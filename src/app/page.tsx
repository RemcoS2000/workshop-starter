import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const readings = await prisma.meterReading.findMany({
    orderBy: { readAt: "desc" },
    take: 10,
    include: { user: { select: { name: true, email: true } } },
  });

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
              {readings.map((r) => (
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
                  <td className="px-4 py-2">{r.user.name ?? r.user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {readings.length === 0 && (
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
