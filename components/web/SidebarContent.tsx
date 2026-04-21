"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  accountLinks,
  educatorLinks,
  EducatorsLinks,
  sidebarLinks,
} from "@/lib/exports/links";
import { AnimateIcon } from "../animate-ui/icons/icon";
import { useState } from "react";

export function SidebarContent({
  onClick,
  isHovered,
}: {
  onClick: () => void;
  isHovered: boolean;
}) {
  const pathname = usePathname();

  const linkToUse = pathname.includes("/educator")
    ? EducatorsLinks
    : sidebarLinks;

  const AccountLinksToUse = pathname.includes("/educator")
    ? educatorLinks
    : accountLinks;

  return (
    <div className="space-y-4 h-[calc(100%-7rem)] ">
      {/* MAIN LINKS */}
      <ul className="space-y-1 px-2">
        {linkToUse.map((item) => {
          return (
            <SidebarItem
              key={item.name}
              item={item}
              pathname={pathname}
              onClick={onClick}
              isSidebarExpanded={isHovered}
            />
          );
        })}
      </ul>

      {/* ACCOUNT SECTION */}
      {AccountLinksToUse.length > 0 && (
        <div className="px-2 pb-4">
          {/* Label - only visible when sidebar is expanded */}
          <p
            className={clsx(
              "px-3 -ml-2 py-2 text-xs uppercase tracking-wide text-muted-foreground/60 transition-all duration-300",
              isHovered ? "opacity-100  " : "opacity-50 ",
            )}
          >
            {isHovered ? "Account" : "Act"}
          </p>

          <ul className="space-y-1">
            {AccountLinksToUse.map((item) => {
              return (
                <SidebarItem
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  onClick={onClick}
                  isSidebarExpanded={isHovered}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ item, pathname, onClick, isSidebarExpanded }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;
  const active =
    item.link === "/learner" || item.link === "/educator"
      ? pathname === item.link
      : pathname.startsWith(item.link);

  return (
    <li
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.link}
        className={clsx(
          "group/link flex items-center gap-3 rounded-xl px-2 py-2.5",
          "text-muted-foreground hover:text-black",
          "hover:bg-primary-light-active transition-all duration-200",
          active && "bg-primary-light-active text-black!",
        )}
        title={item.name}
      >
        <AnimateIcon animate={isHovered || active} animation="default-loop">
          <Icon size={20} className="shrink-0" />
        </AnimateIcon>

        <span
          className={clsx(
            "whitespace-nowrap transition-all duration-300 ease-in-out",
            isSidebarExpanded
              ? "opacity-100 translate-x-0 w-auto"
              : "opacity-0 w-0",
          )}
        >
          {item.name}
        </span>
      </Link>
    </li>
  );
}
