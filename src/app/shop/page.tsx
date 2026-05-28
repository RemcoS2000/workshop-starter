import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function Shop() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
      <header className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Shop
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Seeded HomeWizard-style catalog. Styling is intentionally neutral -
            make it yours.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium underline underline-offset-4"
        >
          &larr; Back
        </Link>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-col rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
              {p.category}
            </div>
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
              {p.description}
            </p>
            <div className="mt-4 font-mono text-base">
              {formatPrice(p.priceCents)}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
