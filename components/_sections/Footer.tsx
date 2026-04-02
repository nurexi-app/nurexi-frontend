"use client";
import { useRef } from "react";
import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Keep your existing interfaces ---
interface SocialLink {
  url: string;
  icon: React.ReactNode;
}

interface FooterColumn {
  title: string;
  isSocial?: boolean;
  links: (string | SocialLink)[];
}

// --- Keep your existing data ---
const footerMenu: FooterColumn[] = [
  {
    title: "Features",
    links: ["Performance", "Security", "Analytics", "Automation"],
  },
  {
    title: "About",
    links: ["Our Story", "Team", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
  {
    title: "Social",
    isSocial: true,
    links: [
      { url: "#", icon: <FaLinkedin size={24} /> },
      { url: "#", icon: <FaXTwitter size={24} /> },
      { url: "#", icon: <FaInstagram size={24} /> },
      { url: "#", icon: <FaFacebook size={24} /> },
    ],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "restart none none none",
        },
      });

      tl.from(".footer-brand", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .from(
          ".footer-column",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .from(
          ".footer-bottom",
          {
            scaleX: 0,
            transformOrigin: "left",
            opacity: 0,
            duration: 0.8,
          },
          "-=0.2",
        );
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className="container py-10 overflow-hidden">
      <section className="flex flex-col md:flex-row justify-between gap-10">
        <div className="footer-brand md:basis-[40%] space-y-4">
          <Image src="/Logo.svg" alt="logo" width={31} height={31} />
          <p className="max-w-xs text-gray-600">
            Join nurses who <span className="font-semibold">study smarter</span>{" "}
            and achieve their NMCN goals every day with{" "}
            <span className="font-semibold">Nurexi</span>.
          </p>
        </div>

        <div className="md:basis-[50%] flex flex-wrap justify-between gap-8">
          {footerMenu.map((column, index) => (
            <div key={index} className="footer-column space-y-4">
              <h3 className="font-bold text-gray-900">{column.title}</h3>
              <ul className={column.isSocial ? "flex gap-4" : "space-y-2"}>
                {column.links.map((link, idx) => {
                  if (column.isSocial && typeof link !== "string") {
                    return (
                      <li key={idx}>
                        <Link
                          href={link.url}
                          className="text-gray-600 hover:text-black transition-transform hover:scale-110 block"
                        >
                          <span>{link.icon}</span>
                        </Link>
                      </li>
                    );
                  }
                  if (typeof link === "string") {
                    return (
                      <li key={idx}>
                        <Link
                          href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-grey hover:text-black transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="footer-bottom border-t mt-10 pt-6 text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Nurexi. All rights reserved.</p>
      </section>
    </footer>
  );
}
