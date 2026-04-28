"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, BookOpen, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BundleCard from "./BundleCard";
import { useAppSelector } from "@/hooks/StoreHooks";

// Mock data - replace with your actual data later
const bundles = [
  {
    id: "1",
    name: "NMCN Complete Bundle",
    description: "Complete NMCN past questions from 2015-2024",
    price: 49.99,
    sessionCount: 45,
  },
  {
    id: "2",
    name: "NCLEX Complete Bundle",
    description: "Complete NCLEX-RN preparation with 2000+ questions",
    price: 59.99,
    sessionCount: 60,
  },
  {
    id: "3",
    name: "Medical-Surgical Bundle",
    description: "Medical-Surgical Nursing past questions",
    price: 29.99,
    sessionCount: 30,
    is_free: true,
  },
  {
    id: "4",
    name: "Psychiatric Nursing Bundle",
    description: "Psychiatric Nursing past questions",
    price: 24.99,
    sessionCount: 25,
  },
  {
    id: "5",
    name: "Community Health Bundle",
    description: "Community Health Nursing past questions",
    price: 24.99,
    sessionCount: 28,
  },
  {
    id: "6",
    name: "Pharmacology Bundle",
    description: "Pharmacology focused questions",
    price: 34.99,
    sessionCount: 35,
  },
];

const courses = [
  {
    id: "c1",
    name: "Anatomy & Physiology",
    description: "Comprehensive video course on human anatomy",
    instructor: "Dr. Sarah Johnson",
  },
  {
    id: "c2",
    name: "Pharmacology Mastery",
    description: "Learn drug classifications and mechanisms",
    instructor: "Prof. Michael Lee",
  },
  {
    id: "c3",
    name: "Medical-Surgical Nursing",
    description: "Advanced concepts in med-surg nursing",
    instructor: "Dr. Emily Chen",
  },
];

type TabType = "bundles" | "courses" | "all";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<TabType>("bundles");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter bundles based on search
  const filteredBundles = bundles.filter((bundle) =>
    bundle.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const showBundles = activeTab === "bundles" || activeTab === "all";
  const showCourses = activeTab === "courses" || activeTab === "all";

  const cartItem = useAppSelector((store) => store.cart.items);
  return (
    <div className="container mx-auto px-4 mt-10  py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explore</h1>
        <Link href="/cart">
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItem.length}
            </span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab("bundles")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "bundles"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Bundles
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "courses"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab === "all" ? "bundles and courses" : activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10  h-9 w-full bg-primary-light"
          />
        </div>
      </div>

      {/* Bundles Section */}
      {showBundles && (
        <div className="mb-10">
          {(activeTab === "bundles" || activeTab === "all") && (
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bundles
            </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBundles.map((bundle, index) => (
              <BundleCard key={bundle.id} index={index} {...bundle} />
            ))}
          </div>

          {filteredBundles.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No bundles found
            </p>
          )}
        </div>
      )}

      {/* Courses Section */}
      {showCourses && (
        <div className="mb-10">
          {(activeTab === "courses" || activeTab === "all") && (
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📚 Courses
            </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No courses found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Bundle Card Component

// Course Card Component
function CourseCard({ name, description, instructor }: any) {
  return (
    <div className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden opacity-70">
      <div className="p-5 space-y-3">
        <div className="p-2 bg-muted rounded-lg w-fit">
          <div className="h-5 w-5 rounded bg-muted-foreground/30" />
        </div>

        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <p className="text-xs text-muted-foreground">By {instructor}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            Coming Soon
          </span>
          <Button size="sm" variant="ghost" className="gap-2">
            <Bell className="h-4 w-4" />
            Notify
          </Button>
        </div>
      </div>
    </div>
  );
}
