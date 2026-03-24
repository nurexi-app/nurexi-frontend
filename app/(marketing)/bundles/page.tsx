// app/bundles/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Clock, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DashboardCaption from "@/components/web/DashboardCaption";
import { formatPrice } from "@/lib/utils";
interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  is_free: boolean;
  is_popular?: boolean;
  features?: string[];
  exam_count?: number;
  question_count?: number;
}

export default async function BundlesPage() {
  const supabase = await createClient();

  // Fetch all available bundles
  const { data: bundles, error } = await supabase
    .from("bundles")
    .select(
      `
      *,
      bundle_questions (
        exam_session_id
      )
    `,
    )
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching bundles:", error);
  }

  // Calculate additional stats for each bundle
  const bundlesWithStats = bundles?.map((bundle) => ({
    ...bundle,
    exam_count: bundle.bundle_questions?.length || 0,
    is_popular:
      bundle.name.includes("Complete") || bundle.name.includes("Popular"),
  }));

  return (
    <>
      <DashboardCaption
        heading="Purchase Exam Bundles"
        text="Choose the perfect package for your nursing exam preparation"
      />

      <section className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header with Cart Icon */}
        <div className="flex justify-end mb-6">
          <Link href="/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundlesWithStats?.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>
    </>
  );
}

// Bundle Card Component
function BundleCard({ bundle }: { bundle: any }) {
  const isFree = bundle.price === 0 || bundle.is_free;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Popular Badge */}
      {bundle.is_popular && (
        <div className="bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 inline-block">
          ⭐ Most Popular
        </div>
      )}

      <CardContent className="p-6 space-y-4">
        {/* Bundle Name */}
        <div>
          <h3 className="text-xl font-bold mb-2">{bundle.name}</h3>
          <p className="text-muted-foreground text-sm">{bundle.description}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{bundle.exam_count} Exam Sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Lifetime Access</span>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-2 text-sm">
          {bundle.features?.slice(0, 3).map((feature: string, idx: number) => (
            <li key={idx} className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="pt-4 border-t">
          {isFree ? (
            <span className="text-2xl font-bold text-green-600">Free</span>
          ) : (
            <div>
              <span className="text-3xl font-bold">
                {formatPrice(bundle.price / 100)}
              </span>
              <span className="text-muted-foreground"> one-time</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {/* <AddToCartButton bundle={bundle} /> */}
      </CardContent>
    </Card>
  );
}
