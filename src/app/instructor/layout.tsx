import { InstructorShell } from "@/components/layout/InstructorShell";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-server";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/auth/login");
  const role = session.user.role;
  if (role !== "INSTRUCTOR" && role !== "ADMIN") redirect("/dashboard");

  return <InstructorShell>{children}</InstructorShell>;
}
