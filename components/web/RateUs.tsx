"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  submitTestimonial,
  hasUserRated,
} from "@/lib/actions/testimonial-actions";
import { cn } from "@/lib/utils";

interface RatePromptProps {
  userId: string;
  examCount: number;
  displayName: string;
}

export function RatePrompt({
  userId,
  examCount,
  displayName,
}: RatePromptProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);

  useEffect(() => {
    async function checkShouldShow() {
      if (examCount >= 3) {
        const hasRated = await hasUserRated(userId);
        if (!hasRated && !dismissed) {
          setTimeout(() => setOpen(true), 2000);
        }
      }
    }
    checkShouldShow();
  }, [examCount, userId, dismissed]);

  const handleSubmit = async () => {
    let hasError = false;

    if (rating === 0) {
      setRatingError(true);
      hasError = true;
    } else {
      setRatingError(false);
    }

    if (!feedback.trim()) {
      setFeedbackError(true);
      hasError = true;
    } else {
      setFeedbackError(false);
    }

    if (hasError) return;

    setIsSubmitting(true);
    const result = await submitTestimonial(
      rating,
      feedback,
      userId,
      displayName,
    );

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.error);
    }

    setIsSubmitting(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setOpen(false);
  };

  // Different messages based on exam count
  const getMotivationalMessage = () => {
    if (examCount === 3) return "You're on a roll! 🎉";
    if (examCount === 4) return "Keep crushing it! 💪";
    if (examCount >= 5) return "You're unstoppable! 🔥";
    return "Great progress! ✨";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {getMotivationalMessage()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <p className="text-center text-muted-foreground">
            You've completed{" "}
            <span className="font-bold text-primary">
              {examCount} practice sessions
            </span>{" "}
            on Nurexi.
            <br />
            <span className="text-sm">
              Your feedback helps us serve nursing students better.
            </span>
          </p>

          {/* Star Rating - Required */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              How would you rate Nurexi?{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-10 w-10 cursor-pointer transition-all",
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400 scale-110"
                      : "text-gray-300 hover:scale-105",
                    ratingError && "ring-2 ring-destructive rounded-full p-1",
                  )}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {ratingError && (
              <p className="text-sm text-destructive flex items-center justify-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please select a rating
              </p>
            )}
          </div>

          {/* Written Feedback - Required */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              Share your experience <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="What do you love about Nurexi? How has it helped you prepare?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className={cn(
                feedbackError && "border-destructive ring-destructive/20",
              )}
            />
            {feedbackError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please share your experience
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Your review may be featured on our homepage (with your permission)
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Maybe later
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
