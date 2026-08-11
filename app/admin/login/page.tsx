import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Rahim's Collection",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-charcoal-light border border-cream/10 rounded-luxury p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-gold mb-2">Admin Login</h1>
          <p className="font-sans text-sm text-cream/60 tracking-wide">
            Sign in to access the dashboard
          </p>
        </div>
        
        <AdminLoginForm />
      </div>
    </div>
  );
}
