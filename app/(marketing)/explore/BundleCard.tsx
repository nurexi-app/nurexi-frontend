"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/StoreHooks";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const gradients = [
  "from-purple-500 via-pink-500 to-red-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-rose-500 via-red-500 to-orange-500",
];

interface BundleCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  sessionCount: number;
  is_free?: boolean;
  index?: number;
}

export default function BundleCard({
  id,
  name,
  description,
  price,
  sessionCount,
  is_free,
  index = 0,
}: BundleCardProps) {
  const gradient = gradients[index % gradients.length];

  const dispatch = useAppDispatch();
  function handleAddToCart() {
    dispatch(
      addToCart({
        id,
        type: "bundle",
        name,
        price,
        sessionCount,
        quantity: 1,
      }),
    );
    toast.success(`${name} added to cart`);
  }
  return (
    <div className="group relative overflow-hidden rounded-xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-90`}
      />

      {/* Content */}
      <div className="relative p-5 space-y-3 text-white">
        <div className="flex items-start justify-between">
          <div className="text-3xl">
            {name.includes("NMCN") && "🎓"}
            {name.includes("NCLEX") && "🌍"}
            {name.includes("Medical") && "💊"}
            {name.includes("Psychiatric") && "🧠"}
            {name.includes("Community") && "👥"}
            {name.includes("Pharmacology") && "💊"}
            {!name.includes("NMCN") &&
              !name.includes("NCLEX") &&
              !name.includes("Medical") &&
              "📚"}
          </div>
          {is_free && (
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              Free
            </span>
          )}
        </div>

        <h3 className="font-semibold text-xl line-clamp-1">{name}</h3>
        <p className="text-sm text-white/80 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-white/70">
              {sessionCount} sessions
            </span>
            <p className="text-2xl font-bold">
              {is_free ? "Free" : `$${price}`}
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
            onClick={() => handleAddToCart()}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
