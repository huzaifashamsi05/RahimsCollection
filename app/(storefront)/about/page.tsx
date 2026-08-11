import AboutContent from "@/components/about/AboutContent";
import { getSettings } from "@/lib/queries/settings";

export const metadata = {
  title: "About Us | Rahim's Collection",
  description: "Discover the artistry and heritage woven into every piece.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  
  return <AboutContent settings={settings} />;
}
