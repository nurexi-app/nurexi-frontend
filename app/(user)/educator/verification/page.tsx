import CompletenessSection from "@/components/user/educator/verification/CompletenessSection";
import VerificationForm from "@/components/user/educator/verification/VerificationForm";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import { getVerificationDetails } from "@/lib/actions/educator-actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MdVerifiedUser } from "react-icons/md";

export const metadata: Metadata = {
  title: "Verification",
  description: "Verification",
};

export default async function VerificationPage() {
  let user;
  let verificationObj;
  try {
    user = await GetUserProfile();
    console.log("user obj :", user);
    if (!user?.id) {
      return redirect("/login?redirectUrl=/educator/verification");
    }
    verificationObj = await getVerificationDetails(user.id);
    console.log(verificationObj);
  } catch (error) {
    notFound();
  }

  return (
    <>
      <DashboardCaption
        heading="Educator Verification & Badges"
        text="Build credibility and showcase your achievements"
      />
      <CompletenessSection
        avatar_url={user.avatar_url}
        verificationStatus={verificationObj?.status}
      />

      {/* certificates */}
      <div className="my-2 md:my-3 lg:my-4 p-2 md:p-3.75 rounded-2xl bg-background">
        <div className="my-2 md:my-3 lg:my-4 p-2 md:p-3.75 rounded-2xl bg-background">
          <h1 className="text-xs md:text-sm mb-2 md:mb-4 font-normal">
            Certification & license verification
          </h1>

          <div className="bg-secondaryLightHover rounded-lg p-4">
            <div className="flex gap-2">
              <MdVerifiedUser className="text-secondary h-6! w-5!" />
              <div className="space-y-0.25 ">
                <h3 className="text-sm leading-[130%] text-secondaryDarker font-normal">
                  Why verify?
                </h3>
                <p className="text-secondaryDarkActive text-xs leading-[130%]">
                  Verified educators receive student trust
                </p>
              </div>
            </div>
          </div>

          <VerificationForm user={user} verificationDetails={verificationObj} />
        </div>
      </div>
    </>
  );
}
