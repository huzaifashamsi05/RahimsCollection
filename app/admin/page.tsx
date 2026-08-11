import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard | Rahim's Collection",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-cream mb-4">
          Welcome back
        </h1>
        <p className="font-sans text-cream/70 text-lg">
          Logged in as: <strong className="text-gold">{user?.email}</strong>
        </p>
        
        <div className="mt-12 p-8 border border-cream/10 bg-cream/5 rounded-luxury text-center">
          <p className="text-cream/50 italic">Dashboard overview and management tools will appear here in future updates.</p>
        </div>
      </div>
    </div>
  );
}
