"use client";
import { Card, CardDescription } from "../ui/card";
import { AnimateIcon } from "../animate-ui/icons/icon";
import Link from "next/link";
import { useState } from "react";

const QuickLinks = ({ item, index }: { item: any; index: number }) => {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card
      className={`${index === 0 ? "border-[#78767D] shadow-xs bg-secondaryDarker" : "bg-card"} border hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-23`}
    >
      <Link
        href={item.href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardDescription
          className={` ${index === 0 ? "text-background" : "text-card-foreground"}  flex items-center flex-col  justify-center gap-2`}
        >
          <AnimateIcon
            animateOnView
            animate={isHovered}
            animation="default-loop"
          >
            <Icon className={`${index === 0 ? "text-white" : "text-black"}`} />
          </AnimateIcon>
          <span className="text-xs md:text-sm ">{item.label}</span>
        </CardDescription>
      </Link>
    </Card>
  );
};

export default QuickLinks;
