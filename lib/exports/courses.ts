import {
  DashboardCourseInterface,
  PublicCourseInterface,
} from "../types/course";

export const dashboardCourses: DashboardCourseInterface[] = [
  {
    id: "course_001",
    title: "Clinical Pharmacology for Nurses",
    description:
      "A practical, scenario-based approach to understanding pharmacology in real clinical settings, including drug calculations, safety checks, and patient education.",
    author: {
      name: "Dr. Amaka Okoye",
      verified: true,
    },
    progress: 65, // percentage
    totalLessons: 42,
    completedLessons: 27,
    lastAccessed: "2026-01-20",
    thumbnail: "/assets/medsurge.jpeg",
    duration: "12h 30m",
    level: "Intermediate",
    tags: ["Pharmacology", "Clinical", "NCLEX"],
  },
  {
    id: "course_002",
    title: "Fundamentals of ICU Nursing",
    description:
      "Learn core ICU concepts including ventilator care, hemodynamic monitoring, and critical patient assessment for newly deployed ICU nurses.",
    author: {
      name: "Clinexi Academy",
      verified: true,
    },
    progress: 18,
    totalLessons: 30,
    completedLessons: 5,
    lastAccessed: "2026-01-18",
    thumbnail: "/assets/medsurge.jpeg",
    duration: "9h 10m",
    level: "Beginner",
    tags: ["ICU", "Critical Care"],
  },
  {
    id: "course_003",
    title: "Occupational Health & Safety for Nurses",
    description:
      "Understand workplace health risks, OSHA principles, and preventive strategies for occupational and industrial health nursing.",
    author: {
      name: "Samuel Adeyemi, RN",
      verified: false,
    },
    progress: 0,
    totalLessons: 18,
    completedLessons: 0,
    lastAccessed: null,
    thumbnail: "/assets/hero3.png",
    duration: "5h 45m",
    level: "Beginner",
    tags: ["OHN", "Workplace Safety"],
  },
];

export const publicCourses: PublicCourseInterface[] = [
  {
    id: "public_001",
    title: "NCLEX-Style Medical Surgical Nursing Masterclass",
    description:
      "Over 1,200 NCLEX-style questions with detailed clinical explanations, memory tips, and exam strategies to help you pass confidently.",
    author: {
      name: "Clinexi Academy",
      verified: true,
    },
    rating: 4.8,
    ratingCount: 1342,
    price: 18000, // NGN
    discountPrice: 12000,
    thumbnail: "/assets/medsurge.jpeg",
    duration: "22h 40m",
    level: "Advanced",
    studentsEnrolled: 5400,
    tags: ["NCLEX", "Exam Prep", "Medical Surgical"],
    isBestSeller: true,
  },
  {
    id: "public_002",
    title: "Basic ECG Interpretation for Nurses",
    description:
      "Master ECG basics, rhythm interpretation, and clinical correlation with real-life nursing scenarios.",
    author: {
      name: "Grace Williams, RN",
      verified: true,
    },
    rating: 4.5,
    ratingCount: 620,
    price: 9500,
    discountPrice: 0,
    thumbnail: "/assets/hero2.png",
    duration: "6h 20m",
    level: "Beginner",
    studentsEnrolled: 2100,
    tags: ["ECG", "Cardiology"],
    isBestSeller: false,
  },
  {
    id: "public_003",
    title: "Infection Prevention & Control in Healthcare",
    description:
      "Learn evidence-based infection control practices, PPE usage, and outbreak prevention strategies for healthcare environments.",
    author: {
      name: "Public Health Institute",
      verified: false,
    },
    rating: 4.2,
    ratingCount: 310,
    price: 7000,
    discountPrice: 5000,
    thumbnail: "/assets/hero3.png",
    duration: "4h 10m",
    level: "Beginner",
    studentsEnrolled: 980,
    tags: ["IPC", "Public Health"],
    isBestSeller: false,
  },
];
