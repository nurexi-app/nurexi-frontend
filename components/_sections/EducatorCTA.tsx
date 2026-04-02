"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export default function EducatorCTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".animate-educator", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast("You're on the list!", {
        duration: 5000,
        description: "We'll reach out as soon as the educator panel launches.",
      });
      setLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <section
      ref={containerRef}
      className="bg-secondaryDarkActive h-90 text-center flex items-center flex-col gap-12 text-white pt-14 pb-22 px-4"
      id="ForEducators"
    >
      <h3 className="font-medium animate-educator">Educator&apos;s Panel</h3>

      <div className="space-y-6 max-w-200 animate-educator">
        <p className="bodyText">
          Are you an experienced nurse or educator? Join Nurexi as a mentor and
          share your knowledge with aspiring nurses through courses and study
          resources.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Become an Educator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join the Educator Waitlist</DialogTitle>
              <DialogDescription>
                We&apos;re currently onboarding our first cohort of mentors.
                Leave your email to get early access.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
              <Input
                type="email"
                placeholder="nursing.pro@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Keep me updated"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
