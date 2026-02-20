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
import { GiHypodermicTest, GiTeacher } from "react-icons/gi";
import { MdVerified } from "react-icons/md";
import { PiCurrencyNgn } from "react-icons/pi";
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
  icon: LucideIcon | IconType;
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

export const EducatorsLinks = [
  {
    name: "Dashboard",
    link: "/learner/",
    icon: LayoutDashboard,
  },
  {
    name: "Course Upload",
    link: "/educator/course-upload",
    icon: GiTeacher,
  },
  {
    name: "Verification",
    link: "/educator/verification",
    icon: MdVerified,
  },
];
export const accountLinks: SidebarAccountLink[] = [
  {
    name: "Profile",
    link: "/learner/profile",
    icon: User,
  },
  {
    name: "Notifications",
    link: "/learner/notification",
    icon: Bell,
  },
];

export const educatorLinks: SidebarAccountLink[] = [
  {
    name: "Profile",
    link: "/educator/profile",
    icon: User,
  },
  {
    name: "Earnings",
    link: "/educator/notification",
    icon: PiCurrencyNgn,
  },
  {
    name: "Notifications",
    link: "/educator/notification",
    icon: Bell,
  },
];
