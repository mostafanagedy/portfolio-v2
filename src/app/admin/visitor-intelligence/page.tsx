import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-auth";
import VisitorDashboard from "@/components/admin/VisitorDashboard";

export const dynamic = "force-dynamic";

export default async function VisitorIntelligencePage() {
  if (!(await isAdminRequest())) redirect("/admin/login");
  return <VisitorDashboard />;
}
