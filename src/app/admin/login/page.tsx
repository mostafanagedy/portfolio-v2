import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminRequest()) redirect("/admin/visitor-intelligence");
  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <p className="admin-eyebrow">NAGEDY / PRIVATE AREA</p>
        <h1>Visitor Intelligence</h1>
        <p>Sign in to view privacy-conscious visitor analytics.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
