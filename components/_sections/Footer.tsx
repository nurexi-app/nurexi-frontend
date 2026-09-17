import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";

const footerColumns = [
  {
    title: "Learn",
    links: [
      { label: "Exam preparation", href: "/explore" },
      { label: "Nursing resources", href: "/resources" },
    ],
  },
  {
    title: "Nurexi",
    links: [
      { label: "About Nurexi", href: "/#about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Verify payment", href: "/verify-payment" },
      { label: "Policies", href: "/policies" },
    ],
  },
];

const socialLinks = [
  {
    label: "Nurexi on LinkedIn",
    href: "https://www.linkedin.com/in/ogechukwu-ochife-88443a284",
    icon: FaLinkedin,
  },
  {
    label: "Nurexi on X",
    href: "https://x.com/nurexiForNurses",
    icon: FaXTwitter,
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="grid gap-14 border-b border-primary-foreground/20 pb-16 lg:grid-cols-[1.2fr_1.8fr] lg:gap-24">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground">
                <Image src="/Logo.svg" alt="" width={27} height={27} />
              </span>
              Nurexi
            </Link>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/75">
              Focused nursing education and exam preparation that helps learners understand what to do next.
            </p>
            <Link
              href="/learner"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary-foreground px-6 font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Explore Nurexi
            </Link>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3" aria-label="Footer navigation">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-sm text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nurexi. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex size-11 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/75 transition-colors hover:bg-primary-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              >
                <Icon aria-hidden="true" className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
