import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardCaption from "@/components/web/DashboardCaption";
// import NotificationSection from "@/components/web/Notification";
import ChangePassword from "@/components/user/learner/profile/ChangePassword";
import { GetUserProfile } from "@/lib/actions/auth";
import { toast } from "sonner";
import DisplayName from "@/components/user/learner/profile/DisplayName";
import UploadProfilePic from "@/components/user/learner/profile/UploadProfilePic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account preferences",
};

export default async function ProfilePage() {
  let user;
  try {
    user = await GetUserProfile();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong");
    }
  }
  return (
    <>
      <DashboardCaption
        heading="Profile"
        text="Manage your account preferences"
      />

      <div className="p-2 md:p-5 bg-custom-background md:bg-background rounded-xl mt-2 md:mt-4 ">
        <div className="mb-5 space-y-px max-sm:hidden ">
          <h4>Profile Information</h4>
          <p className="bodyText text-muted-foreground">
            Update your personal details
          </p>
        </div>
        <p className="font-extralight -mt-5 mb-4 max-sm:block hidden">
          manage your profile settings
        </p>

        <div className="flex items-center justify-between max-sm:flex-wrap">
          <div className="flex items-center gap-1 md:gap-2.5">
            <Avatar className="size-11.5 md:size-15">
              <AvatarImage src={user?.avatar_url || ""} />
              <AvatarFallback>OC</AvatarFallback>
            </Avatar>

            <div className="space-y-px ">
              <p className="bodyText font-semibold">{user?.full_name}</p>
              <p className="bodyText text-muted-foreground">{user?.email}</p>
              {user?.roles.includes("learner") && (
                <Badge variant="outline" className="-ml-2">
                  Learner
                </Badge>
              )}
            </div>
          </div>

          <UploadProfilePic userId={user?.id} />
        </div>

        <DisplayName name={user?.full_name} />
      </div>

      {/* notification */}

      <div className="p-2 md:p-5 bg-custom-background md:bg-background rounded-xl mt-2 md:mt-4 ">
        {/* <div className="mb-5 space-y-px">
          <h4>Notification</h4>
          <p className="bodyText text-muted-foreground">
            Choose how you want to be notified
          </p>
        </div> */}

        {/* <NotificationSection /> */}
        <ChangePassword />
      </div>
    </>
  );
}
