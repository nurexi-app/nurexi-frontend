import { GiTeacher } from "react-icons/gi";
import { MdVerified } from "react-icons/md";
import { PiCurrencyNgn } from "react-icons/pi";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "@/components/animate-ui/icons/layout-dashboard";
import { Compass } from "@/components/animate-ui/icons/compass";
import { Airplay } from "@/components/animate-ui/icons/airplay";
import { ChartSpline } from "@/components/animate-ui/icons/chart-spline";
import { PinOff } from "@/components/animate-ui/icons/pin-off";
import { Binary } from "@/components/animate-ui/icons/binary";
import { MessageSquarePlus } from "@/components/animate-ui/icons/message-square-plus";
import { ComponentType } from "react";
import { User } from "@/components/animate-ui/icons/user";
import { Bell } from "@/components/animate-ui/icons/bell";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";

export interface SidebarLink {
  name: string;
  link: string;
  icon: LucideIcon | ComponentType<any>;
}

export interface SidebarAccountLink {
  name: string;
  link: string;
  icon: LucideIcon | ComponentType<any>;
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
    link: "/explore",
    icon: Compass,
  },
  {
    name: "Courses",
    link: "/learner/courses",
    icon: MessageSquarePlus,
  },
  {
    name: "Practice Questions",
    link: "/learner/practice",
    icon: Binary,
  },
  {
    name: "Mock Exams",
    link: "/learner/exam",
    icon: Airplay,
  },
  {
    name: "Progress",
    link: "/learner/analytics",
    icon: ChartSpline,
  },
  {
    name: "Library",
    link: "/learner/library",
    icon: PinOff,
  },
];

export const EducatorsLinks = [
  {
    name: "Dashboard",
    link: "/educator",
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
    icon: BadgeCheck,
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
