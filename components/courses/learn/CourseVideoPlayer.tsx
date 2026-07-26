"use client";

import { CldVideoPlayer } from "next-cloudinary";
import ReactPlayer from "react-player";
import "next-cloudinary/dist/cld-video-player.css";
import { useEffect, useState } from "react";
import { Lesson, LessonAsset } from "@/lib/types/course";
import { useMutation } from "@tanstack/react-query";
import { useLearnContext } from "@/context/LearnProvider";
import { toggleLessonProgress } from "@/lib/actions/learner-course-actions";
import { useRouter } from "next/navigation";

interface CourseVideoPlayerProps {
  lesson: Partial<Lesson>;
}

const COUNTDOWN_SECONDS = 5;
export function CourseVideoPlayer({ lesson }: CourseVideoPlayerProps) {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const lessonId = lesson?.id as string;
  const asset = lesson?.asset as LessonAsset;
  const { course, completedLessons, setCompletedLessons } = useLearnContext();
  const courseId = course?.id as string;

  const { mutate } = useMutation({
    mutationFn: ({
      lessonId,
      isCompleted,
    }: {
      lessonId: string;
      isCompleted: boolean;
    }) => toggleLessonProgress(lessonId, courseId, isCompleted),

    onError: (error, variables) => {
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(variables.lessonId);
        return newSet;
      });
    },
  });

  // Autoplay overlay states
  const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  // 1. Calculate the next lesson in the course order
  const allLessons =
    course?.course_sections
      ?.sort((a, b) => a.position - b.position)
      .flatMap((section) =>
        (section.course_lessons || []).sort((a, b) => a.position - b.position),
      ) || [];

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson =
    currentIndex !== -1 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const handleEnded = () => {
    const isAlreadyCompleted = completedLessons.has(lessonId);
    if (!isAlreadyCompleted) {
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        newSet.add(lessonId);
        return newSet;
      });
      mutate({ lessonId, isCompleted: false });
    }

    // Trigger overlay if there's a next lesson
    if (nextLesson) {
      setCountdown(COUNTDOWN_SECONDS);
      setShowOverlay(true);
    }
  };

  // 3. Countdown timer effect
  useEffect(() => {
    if (!showOverlay || !nextLesson) return;

    if (countdown <= 0) {
      handleNavigateToNext();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOverlay, countdown, nextLesson]);

  // Reset overlay when switching lessons
  useEffect(() => {
    setShowOverlay(false);
    setCountdown(COUNTDOWN_SECONDS);
  }, [lessonId]);

  const handleNavigateToNext = () => {
    if (nextLesson) {
      router.push(`/learner/courses/${course.slug}/learn/${nextLesson.id}`);
    }
  };

  const handleCancelAutoplay = () => {
    setShowOverlay(false);
  };

  if (!isMounted) {
    return <div className="w-full aspect-video bg-grey/40 animate-pulse" />;
  }

  if (showOverlay && nextLesson) {
    return (
      <div className="w-full aspect-video max-h-full max-w-full bg-grey/30 relative">
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col text-white">
          <p className="text-2xl font-bold">Up next:</p>
          <p className="text-xl font-bold">{nextLesson?.title}</p>
          <button
            onClick={handleCancelAutoplay}
            className="mt-4 px-4 py-2 bg-white/90 text-black font-semibold text-sm rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  if (asset?.public_id && asset.provider === "cloudinary") {
    return (
      <div className="w-full aspect-video max-h-full max-w-full bg-grey/30 relative">
        <CldVideoPlayer
          id={`player-${asset.public_id}`}
          width="1920"
          height="1080"
          src={asset.public_id}
          colors={{
            accent: "#5ab9ff",
          }}
          onEnded={() => {
            handleEnded();
          }}
          // fontFace="Inter"
        />
      </div>
    );
  }

  // fallback
  const fallbackUrl = asset?.playback_url || asset?.secure_url;

  if (fallbackUrl) {
    return (
      <div className="w-full aspect-video bg-grey/40 relative">
        <ReactPlayer
          src={fallbackUrl}
          width="100%"
          height="100%"
          controls
          onEnded={() => {
            handleEnded();
          }}
          // config={{
          //   youtube: {

          //   }
          // }}
        />
      </div>
    );
  }

  // 3. NO VIDEO STATE
  return (
    <div className="w-full aspect-video bg-muted flex items-center justify-center flex-col text-muted-foreground">
      <p>No video source available for this lesson.</p>
    </div>
  );
}
