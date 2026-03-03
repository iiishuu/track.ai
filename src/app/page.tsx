import { Hero } from "@/frontend/components/landing/Hero";
import { AILogos } from "@/frontend/components/landing/AILogos";
import { HowItWorks } from "@/frontend/components/landing/HowItWorks";
import { Features } from "@/frontend/components/landing/Features";
import { Stats } from "@/frontend/components/landing/Stats";
import { FinalCTA } from "@/frontend/components/landing/FinalCTA";
import { Footer } from "@/frontend/components/landing/Footer";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Hero />
      <AILogos />
      <HowItWorks />
      <Features />
      <Stats />
      <FinalCTA />
      <Footer />
    </div>
  );
}
