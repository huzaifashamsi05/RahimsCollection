import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { getSettings } from "@/lib/queries/settings";

export const metadata = {
  title: "Site Settings | Admin | Rahim's Collection",
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal mb-2">Site Settings</h1>
        <p className="text-charcoal/60 text-sm">Manage storefront content and media directly.</p>
      </div>

      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
