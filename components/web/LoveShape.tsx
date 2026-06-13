// components/ui/love-shape.tsx
import { cn } from "@/lib/utils";

interface LoveShapeProps {
  className?: string;
}

function LoveShape({ className }: LoveShapeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="5%" stopColor="#FE1183" />
          <stop offset="95%" stopColor="#A633C0" />
        </linearGradient>
      </defs>

      {/* Heart shape - standard SVG path */}
      <path
        d="M50 88.5C50 88.5 8 58 8 35C8 15 22 5 35 5C45 5 50 15 50 20C50 15 55 5 65 5C78 5 92 15 92 35C92 58 50 88.5 50 88.5Z"
        fill="url(#loveGradient)"
        stroke="url(#loveGradient)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Optional: Inner highlight for 3D effect */}
      <path
        d="M50 80C50 80 18 55 18 36C18 22 28 12 38 12C46 12 50 20 50 24C50 20 54 12 62 12C72 12 82 22 82 36C82 55 50 80 50 80Z"
        fill="url(#loveGradient)"
        opacity="0.3"
      />
    </svg>
  );
}

export default LoveShape;
