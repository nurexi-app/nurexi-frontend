// lib/exports/mock-exams.ts
import { BookOpen, Lock } from "lucide-react";

export type ExamType = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  examsCount?: number;
  image: string;
};

export const examTypes: ExamType[] = [
  {
    id: "nmcn",
    name: "NMCN",
    description: "Official Nigerian nursing council mock exams",
    available: true,
    examsCount: 5,
    image: "/assets/nmcn.png",
  },
  {
    id: "nmc-uk",
    name: "NMC UK",
    description: "UK nursing CBT-style mock exams",
    available: false,
    image: "/assets/nmcn.png",
  },
  {
    id: "nclex",
    name: "NCLEX-RN",
    description: "US NCLEX simulation exams",
    available: false,
    image: "/assets/nmcn.png",
  },
];
