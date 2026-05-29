"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const { error } = await signOut();
        if (error) {
          console.error("Sign out failed:", error);
          return;
        }
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
