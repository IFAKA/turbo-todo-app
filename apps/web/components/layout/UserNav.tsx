import { getSession, signOut } from "@repo/auth";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export async function UserNav() {
  const session = await getSession();

  if (!session) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm text-muted-foreground">
          {session.user?.name ?? session.user?.email}
        </span>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.HOME });
        }}
      >
        <button
          type="submit"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
