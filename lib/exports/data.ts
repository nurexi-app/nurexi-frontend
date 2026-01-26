import {
  LayoutDashboard,
  Compass,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Library,
  User,
  Bell,
} from "lucide-react";
import { GiHypodermicTest } from "react-icons/gi";
import { IconType } from "react-icons/lib";
import type { LucideIcon } from "lucide-react";

export interface SidebarLink {
  name: string;
  link: string;
  icon: LucideIcon | IconType;
}

export interface SidebarAccountLink {
  name: string;
  link: string;
  icon: LucideIcon;
}

export type SidebarItem = SidebarLink;

export const sidebarLinks: SidebarItem[] = [
  {
    name: "Dashboard",
    link: "/learner",
    icon: LayoutDashboard,
  },
  {
    name: "Explore",
    link: "/explore-courses",
    icon: Compass,
  },
  {
    name: "Courses",
    link: "/learner/courses",
    icon: BookOpen,
  },
  {
    name: "Practice Questions",
    link: "/learner/practice",
    icon: ClipboardList,
  },
  {
    name: "Mock Exams",
    link: "/learner/exam",
    icon: GiHypodermicTest,
  },
  {
    name: "Progress",
    link: "/learner/analytics",
    icon: TrendingUp,
  },
  {
    name: "Library",
    link: "/learner/library",
    icon: Library,
  },
];
export const accountLinks: SidebarAccountLink[] = [
  {
    name: "Profile",
    link: "/account/profile",
    icon: User,
  },
  {
    name: "Notifications",
    link: "/account/notifications",
    icon: Bell,
  },
];
