import { getSession, signOut } from "@repo/auth";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ROUTES } from "@/lib/constants";
import { LogIn, LogOut } from "lucide-react";

export async function UserNav() {
  const session = await getSession();

  if (!session) {
    return (
      <Button variant="ghost" size="icon-sm" asChild>
        <Link href={ROUTES.LOGIN}>
          <LogIn className="size-4" />
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt=""
          className="size-7 rounded-full"
        />
      )}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.HOME });
        }}
      >
        <Button variant="ghost" size="icon-sm" type="submit">
          <LogOut className="size-4" />
        </Button>
      </form>
    </div>
  );
}
