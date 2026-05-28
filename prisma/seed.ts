import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.meterReading.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "demo@homewizard.local",
      name: "Demo User",
      emailVerified: true,
    },
  });
  console.log(`  Created user: ${user.email}`);

  // Realistic cumulative smart-meter values: electricity in kWh, gas/water in m3.
  // Spread across 7 days, monotonically increasing (matches P1 telegram output).
  const readings: {
    readAt: Date;
    kind: string;
    value: number;
    unit: string;
  }[] = [];
  const start = new Date("2026-04-08T00:00:00Z");
  let kwh = 14523.412;
  let gas = 2841.55;
  let water = 312.84;
  for (let day = 0; day < 7; day++) {
    const at = new Date(start);
    at.setUTCDate(start.getUTCDate() + day);
    readings.push({
      readAt: new Date(at),
      kind: "electricity",
      value: Number(kwh.toFixed(3)),
      unit: "kWh",
    });
    readings.push({
      readAt: new Date(at),
      kind: "gas",
      value: Number(gas.toFixed(2)),
      unit: "m3",
    });
    readings.push({
      readAt: new Date(at),
      kind: "water",
      value: Number(water.toFixed(2)),
      unit: "m3",
    });
    kwh += 7.6 + Math.random() * 2.4;
    gas += 0.8 + Math.random() * 0.5;
    water += 0.12 + Math.random() * 0.08;
  }

  await prisma.meterReading.createMany({
    data: readings.map((r) => ({ ...r, userId: user.id })),
  });
  console.log(`  Created ${readings.length} meter readings`);

  const products = [
    {
      slug: "p1-meter",
      name: "P1 Meter",
      description:
        "Real-time energy insights from your smart meter. Plug it into the P1 port and see usage in the app.",
      priceCents: 3995,
      category: "energy",
    },
    {
      slug: "energy-socket",
      name: "Energy Socket",
      description:
        "Smart plug that measures power consumption of any appliance and switches it on or off remotely.",
      priceCents: 3495,
      category: "energy",
    },
    {
      slug: "kwh-meter-1-phase",
      name: "kWh Meter (1-phase)",
      description:
        "Measure energy use of a single circuit. Clamps around the live wire, no rewiring required.",
      priceCents: 6995,
      category: "energy",
    },
    {
      slug: "watermeter",
      name: "Watermeter",
      description:
        "Track water consumption down to the litre. Pairs with most Dutch household water meters.",
      priceCents: 5995,
      category: "water",
    },
    {
      slug: "energy-display",
      name: "Energy Display",
      description:
        "Compact dashboard for the kitchen counter. Shows current usage, today, and this month at a glance.",
      priceCents: 12995,
      category: "accessories",
    },
    {
      slug: "p1-splitter",
      name: "P1 Splitter",
      description:
        "Split your smart-meter P1 port so the P1 Meter and a second reader can run side by side.",
      priceCents: 1995,
      category: "accessories",
    },
  ];

  await prisma.product.createMany({ data: products });
  console.log(`  Created ${products.length} products`);

  console.log("Done. Run 'npm run dev' and open http://localhost:3000.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
