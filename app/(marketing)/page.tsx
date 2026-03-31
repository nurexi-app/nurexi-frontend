import HeroSection from "../../components/_sections/Hero";
import KeyFeatures from "../../components/_sections/KeyFeatures";
import EducatorCTA from "../../components/_sections/EducatorCTA";
import HelporQuestions from "../../components/_sections/HelporQuestions";
import FAQSection from "../../components/_sections/Faqs";
import HowItWorks from "../../components/_sections/LearningAndPrep";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <KeyFeatures />
      <HowItWorks />
      <EducatorCTA />
      <FAQSection />
      <HelporQuestions />
    </>
  );
}
