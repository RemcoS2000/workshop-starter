import fs from "node:fs";
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (!fs.existsSync(".env")) {
  fs.copyFileSync(".env.example", ".env");
  console.log("Created .env from .env.example");
}

run("prisma generate");

const dbStat = fs.existsSync("prisma/dev.db") ? fs.statSync("prisma/dev.db") : null;
const dbIsEmpty = !dbStat || dbStat.size === 0;

run("prisma migrate deploy");

if (dbIsEmpty) {
  console.log("Fresh database detected, seeding demo data...");
  run("prisma db seed");
}
