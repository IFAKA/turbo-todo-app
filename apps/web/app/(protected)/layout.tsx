import { requireAuth } from "@repo/auth";
import { ROUTES } from "@/lib/constants";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(ROUTES.LOGIN);
  return <>{children}</>;
}
