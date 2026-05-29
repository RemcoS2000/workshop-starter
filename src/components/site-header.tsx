import Link from "next/link";
import { getSession } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <Link href="/" className="font-semibold">
        Workshop
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/shop">Shop</Link>
        {session ? (
          <>
            <span>{session.user.name ?? session.user.email}</span>
            <SignOutButton />
          </>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </nav>
    </header>
  );
}
