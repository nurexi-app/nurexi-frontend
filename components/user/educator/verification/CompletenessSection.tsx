"use client";
import { Progress } from "@/components/animate-ui/components/radix/progress";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { X } from "@/components/animate-ui/icons/x";

const CompletenessSection = ({
  avatar_url,
  verificationStatus,
}: {
  avatar_url: string | null;
  verificationStatus: string;
}) => {
  return (
    <div className="my-2 md:my-3 lg:my-4 p-2 md:p-3.75 rounded-2xl bg-background">
      <h1 className="text-xs md:text-sm mb-2 md:mb-4 font-normal">
        Profile Completeness
      </h1>

      <div className="flex justify-between mb-1 ">
        <p className="text-xs md:text-sm font-normal">
          {verificationStatus === "approved" ? 100 : 40}% Complete
        </p>
        <p className="text-xs md:text-sm rounded p-0.75 bg-primary/20 font-normal">
          {verificationStatus === "approved" ? "All Set!" : "Almost there!"}
        </p>
      </div>
      <Progress value={verificationStatus === "approved" ? 100 : 40} />

      <div className="my-6 space-y-1">
        <div className="flex items-center text-green-500 gap-1">
          <AnimateIcon animateOnView>
            <BadgeCheck animation="check" className="size-3.25! " />
          </AnimateIcon>
          <h3 className="text-xs md:text-sm leading-[130%] font-normal">
            Basic Information
          </h3>
        </div>

        <div className="flex items-center text-green-500 gap-1">
          <AnimateIcon animateOnView>
            <BadgeCheck animation="check" className="size-3.25! " />
          </AnimateIcon>
          <h3 className="text-xs md:text-sm leading-[130%] font-normal">
            Email Address
          </h3>
        </div>

        <div
          className={`flex items-center ${avatar_url ? "text-green-500" : "text-red-200"} gap-1`}
        >
          {avatar_url ? (
            <AnimateIcon animateOnView>
              <BadgeCheck animation="check" className="size-3.25! " />
            </AnimateIcon>
          ) : (
            <AnimateIcon animateOnView>
              <X animation="path" className="size-3.25! " />
            </AnimateIcon>
          )}
          <h3 className="text-xs md:text-sm leading-[130%] font-normal">
            Profile Photo
          </h3>
        </div>
        <div
          className={`flex items-center ${
            verificationStatus === "approved"
              ? "text-green-500"
              : "text-red-200"
          } gap-1`}
        >
          {verificationStatus === "approved" ? (
            <BadgeCheck className="size-3.25! " />
          ) : (
            <AnimateIcon animateOnView>
              <X animation="path" className="size-3.25! " />
            </AnimateIcon>
          )}
          <h3 className="text-xs md:text-sm leading-[130%] font-normal">
            Professional credentials
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CompletenessSection;
