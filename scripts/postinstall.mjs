import fs from "node:fs";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (!fs.existsSync(".env")) {
  const secret = crypto.randomBytes(32).toString("base64");
  const contents = fs
    .readFileSync(".env.example", "utf8")
    .replace(/^(BETTER_AUTH_SECRET=).*$/m, `$1"${secret}"`);
  fs.writeFileSync(".env", contents);
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
