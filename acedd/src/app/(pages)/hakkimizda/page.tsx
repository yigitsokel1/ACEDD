import { Metadata } from "next";
import { HeroSection, MissionVisionSection, ValuesSection, TeamSection, HistorySection } from "./components";
import { getPageSeo } from "@/lib/settings";

// Disable caching to ensure fresh content from settings
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("about");
  
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionVisionSection />
      <ValuesSection />
      <HistorySection />
      <TeamSection />
    </div>
  );
}
