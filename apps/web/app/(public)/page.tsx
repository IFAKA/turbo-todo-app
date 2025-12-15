import { getSession } from "@repo/auth";
import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default async function LandingPage() {
  const session = await getSession();

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to {APP_NAME}</h1>
        <p className="text-muted-foreground text-lg">
          The simplest way to manage your tasks
        </p>
        <Link
          href={session ? ROUTES.DASHBOARD : ROUTES.LOGIN}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {session ? "Go to Dashboard →" : "Get Started →"}
        </Link>
      </div>
    </main>
  );
}
