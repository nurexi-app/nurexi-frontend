import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HelporQuestions from "@/components/_sections/HelporQuestions";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Nurexi",
  description:
    "Find answers to the most commonly asked questions about Nurexi for both learners and educators.",
};

const faqs = [
  {
    category: "General Information",
    questions: [
      {
        q: "What is Nurexi?",
        a: "Nurexi is a specialized platform designed to help nursing students prepare for their exams and enable nursing educators to create, share, and monetize high-quality practice questions and courses.",
      },
      {
        q: "How is Nurexi different from other nursing prep platforms?",
        a: "Unlike traditional platforms, Nurexi offers a community-driven marketplace where verified educators can publish specialized exam bundles. This ensures a diverse, up-to-date, and highly relevant pool of questions for learners. Furthermore, learners can access specific exams with a one-time purchase rather than being locked into expensive monthly subscriptions.",
      },
      {
        q: "Who can use Nurexi?",
        a: "Nurexi is built for two main groups: Nursing students (learners) looking for rigorous exam preparation, and qualified nursing professionals (educators) who want to share their expertise and earn income.",
      },
    ],
  },
  {
    category: "For Learners (Students)",
    questions: [
      {
        q: "Are the practice exams up-to-date with current nursing standards?",
        a: "Yes. Our exams are created by verified nursing professionals and educators. We regularly review and encourage content updates to align with the latest NCLEX and general nursing guidelines.",
      },
      {
        q: "How does the pricing work? Is there a monthly subscription?",
        a: "We believe in flexible, accessible learning. Rather than a monthly subscription, Nurexi allows you to make one-time purchases for specific exam bundles or courses. Once purchased, you get lifetime access to that content.",
      },
      {
        q: "Can I customize my practice sessions?",
        a: "Absolutely! You can choose the specific number of questions you want to tackle in a session, allowing you to practice according to your schedule, whether you have 10 minutes or 2 hours.",
      },
      {
        q: "Do I get rationales for both correct and incorrect answers?",
        a: "Yes. Understanding the 'why' is crucial in nursing. Every question comes with detailed rationales for all options to help you understand the core concepts behind the correct answer.",
      },
      {
        q: "Can I access my exams on mobile devices?",
        a: "Nurexi is fully responsive and optimized for all devices. You can practice on your phone, tablet, or desktop computer seamlessly.",
      },
    ],
  },
  {
    category: "For Educators",
    questions: [
      {
        q: "How can I become an educator on Nurexi?",
        a: "You can sign up as an educator and complete our verification process. This typically involves submitting your nursing credentials (like a government ID and nursing license) for our team to review and approve.",
      },
      {
        q: "How do I get paid for the content I create?",
        a: "Educators earn money every time a learner purchases their exam bundles. We handle the payment processing, and your earnings are directly credited to your educator wallet, which you can withdraw to your bank account.",
      },
      {
        q: "What kind of content can I upload?",
        a: "You can create comprehensive exams consisting of multiple-choice, select-all-that-apply (SATA), and true/false questions. You can group these exams into thematic bundles for learners to purchase.",
      },
      {
        q: "Is there a review process for the exams I create?",
        a: "While educators have the freedom to publish, we maintain a community-reporting and internal audit system to ensure all content meets our high standards for accuracy and quality.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I reset my password?",
        a: "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send a secure reset link to your registered email address.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can request account deletion from your account settings. Please note that this action is irreversible and you will lose access to all purchased content.",
      },
      {
        q: "What should I do if I find an error in a question?",
        a: "We value accuracy! Each question has a reporting feature. If you spot an error, please report it, and our review team will address it promptly.",
      },
      {
        q: "How fast is customer support?",
        a: "We typically respond to all support inquiries within 24 hours. You can reach us via email or WhatsApp as detailed on our Contact Us page.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container px-4 sm:px-6 mx-auto mt-32 mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4 text-gray-800">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about Nurexi. Can't find the answer
          you're looking for? Reach out to our support team.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-24 max-w-3xl">
        <div className="space-y-12">
          {faqs.map((faqGroup, index) => (
            <div key={index}>
              <h3 className="text-xl font-medium text-black/80 mb-5 mt-3 border-b border-primary/15 pb-2">
                {faqGroup.category}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqGroup.questions.map((faq, i) => (
                  <AccordionItem 
                    key={i} 
                    value={`item-${index}-${i}`} 
                    className="border-b border-primary/15"
                  >
                    <AccordionTrigger className="text-left font-medium text-black/80 hover:no-underline hover:text-primary transition-colors py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="bodyText text-grey leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      <HelporQuestions />
    </main>
  );
}
