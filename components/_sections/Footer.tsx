import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

// Define interfaces for Type Safety
interface SocialLink {
  url: string;
  icon: React.ReactNode;
}

interface FooterColumn {
  title: string;
  isSocial?: boolean;
  links: (string | SocialLink)[];
}

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
  return (
    <footer className="container py-10">
      <section className="flex flex-col md:flex-row justify-between gap-10">
        <div className="md:basis-[40%] space-y-4">
          <Image src="/Logo.svg" alt="logo" width={31} height={31} />
          <p className="max-w-xs text-gray-600">
            Join nurses who <span className="font-semibold">study smarter</span>
            and achieve their NMCN goals every day with{" "}
            <span className="font-semibold">Nursify</span>.
          </p>
        </div>

        {/* Menus */}
        <div className="md:basis-[50%] flex flex-wrap justify-between gap-8">
          {footerMenu.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-bold text-gray-900">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, idx) => {
                  // Handle Social Links (Objects)
                  if (column.isSocial && typeof link !== "string") {
                    return (
                      <li key={idx}>
                        <Link
                          href={link.url}
                          className="flex items-center justify-center gap-2 hover:underline"
                        >
                          <span>{link.icon}</span>
                        </Link>
                      </li>
                    );
                  }

                  // Handle Standard Links (Strings)
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

      <section className="border-t mt-10 pt-6 text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Nursify. All rights reserved.</p>
      </section>
    </footer>
  );
}
