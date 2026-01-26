"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { accountLinks, sidebarLinks } from "@/lib/exports/data";

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-[80%] flex-col">
      {/* MAIN LINKS */}
      <ul className="space-y-1 px-2">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.link;

          return (
            <li key={item.name}>
              <Link
                href={item.link}
                className={clsx(
                  "group/item flex items-center gap-3 rounded-xl px-3 py-2",
                  "text-muted-foreground hover:text-black",
                  "hover:bg-primary-light-active transition-all",
                  active && "bg-primary-light-active text-black!",
                )}
              >
                <Icon
                  size={20}
                  className="transition-transform  group-hover/item:scale-110"
                />

                <span
                  className="
                    whitespace-nowrap
                    lg:opacity-0 lg:hidden 
                   
                    group-hover/sidebar:block
                    group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0
                    transition-all duration-200
                  "
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ACCOUNT SECTION */}
      {accountLinks.length && (
        <div className="mt-5 px-2 pb-4">
          {/* Greyed label */}
          <p
            className="
              px-3 py-2 text-xs uppercase tracking-wide
              text-muted-foreground/60
              opacity-0 group-hover/sidebar:opacity-100
              transition-opacity
            "
          >
            Account
          </p>

          <ul className="space-y-1">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.link;

              return (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={clsx(
                      "group/item flex items-center gap-3 rounded-xl px-3 py-2",
                      "text-muted-foreground hover:text-black",
                      "hover:bg-primary-light-active transition-all",
                      active && "bg-primary-light-active text-black",
                    )}
                  >
                    <Icon
                      size={18}
                      className="transition-transform  group-hover/item:scale-110"
                    />
                    <span
                      className="
                        whitespace-nowrap
                        opacity-0 translate-x-2
                        group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0
                        transition-all duration-200
                      "
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
