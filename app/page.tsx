import { ModeToggle } from "@/components/web/ThemeSwitcher";
import HeroSection from "./_sections/Hero";
import KeyFeatures from "./_sections/KeyFeatures";
import EducatorCTA from "./_sections/EducatorCTA";
import HelporQuestions from "./_sections/HelporQuestions";
import FAQSection from "./_sections/Faqs";
import Footer from "./_sections/Footer";
import Navbar from "@/components/web/Navbar";
import HowItWorks from "./_sections/LearningAndPrep";

export default function Home() {
  return (
    <main>
      <ModeToggle />
      <Navbar />
      <HeroSection />
      <KeyFeatures />
      <HowItWorks />
      <EducatorCTA />
      <FAQSection />
      <HelporQuestions />
      <Footer />
    </main>
  );
}
