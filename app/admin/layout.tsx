import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { adminLogout } from "@/lib/actions/auth";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-charcoal text-cream flex flex-col lg:flex-row">
      {user && <AdminSidebar email={user.email} />}
      
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-[calc(100vh-65px)] lg:min-h-screen bg-[#FAF7F2] text-charcoal">
        {children}
      </main>
    </div>
  );
}
