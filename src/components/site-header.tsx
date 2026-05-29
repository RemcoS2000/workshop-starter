import Link from "next/link";
import { getSession } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header
      className="flex items-center justify-between px-6 py-3"
      style={{ backgroundColor: "var(--hw-navy)" }}
    >
      <Link
        href="/"
        className="font-semibold text-white transition-colors hover:text-[var(--hw-cyan)]"
      >
        HomeWizard
      </Link>
      <nav className="flex items-center gap-4 text-sm text-white">
        <Link
          href="/shop"
          className="transition-colors hover:text-[var(--hw-cyan)]"
        >
          Shop
        </Link>
        {session ? (
          <>
            <span className="opacity-80">
              {session.user.name ?? session.user.email}
            </span>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="transition-colors hover:text-[var(--hw-cyan)]"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
