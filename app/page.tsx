import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/20">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  );
}
