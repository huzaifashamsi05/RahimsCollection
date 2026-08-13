import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { getSettings } from "@/lib/queries/settings";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <>
      <Navbar />
      {children}
      <Footer settings={settings} />
      <FloatingWhatsApp />
    </>
  );
}
