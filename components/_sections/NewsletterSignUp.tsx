"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { subscribeToNewsletter } from "@/lib/actions/newsletter-actions";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements =
        containerRef.current?.querySelectorAll(".animate-reveal");
      if (elements) {
        gsap.from(elements, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "restart none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      }
    },
    { scope: containerRef },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(email, firstName);

      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message);
        setEmail("");
        setFirstName("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section ref={containerRef} className="bg-secondaryDarkActive py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            You're subscribed!
          </h3>
          <p className="text-muted-foreground">
            Thank you for joining our newsletter. You'll receive updates about
            new sessions, features, and exam tips.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="bg-secondaryDarkActive py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="space-y-2 mb-6 animate-reveal">
          <h5 className="text-2xl font-semibold text-white">
            Stay Updated with Nurexi
          </h5>
          <p className="text-muted-foreground">
            Get the latest exam sessions, practice questions, and study tips
            delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-reveal">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-white"
            />
            <Input
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white"
            />
            <Button type="submit" disabled={isLoading} className="sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}
