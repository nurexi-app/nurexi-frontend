import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Play, MoreVertical, CheckCircle, Share2 } from "lucide-react";
import { Progress } from "../ui/progress";
import Image from "next/image";

interface LearnerCourseCardProps {
  title: string;
  author: string;
  verified?: boolean;
  progress: number;
  img: string;
}

export function LearnerCourseCard({
  title,
  author,
  verified,
  progress,
  img,
}: LearnerCourseCardProps) {
  return (
    <Card className="group p-0 transition-all duration-300 relative overflow-hidden hover:shadow-md ease-in-out">
      <CardHeader className="rounded-2xl mb-0 overflow-hidden relative w-full h-29 lg:h-53">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={"absolute top-2 right-2 z-30"}
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 size={14} /> Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition duration-300"
        />
      </CardHeader>
      {/* Hover play overlay */}
      <div
        className="
        absolute inset-0 z-10
        flex items-center justify-center
        bg-black/5 opacity-0 duration-300 ease-in-out cursor-pointer
        group-hover:opacity-100 transition
      "
      >
        <Play className="text-white" size={42} />
      </div>

      <CardContent className="p-2 md:p-4 space-y-1.5 md:space-y-3">
        {/* Top row */}

        <CardTitle>
          <h3 className="font-semibold leading-snug line-clamp-2">{title}</h3>
        </CardTitle>

        {/* Author */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>{author}</span>
          {verified && <CheckCircle size={14} className="text-primary" />}
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <Progress value={progress} />
          <span className="text-xs text-muted-foreground">
            {progress}% completed
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
