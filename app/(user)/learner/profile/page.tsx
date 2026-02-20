import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardCaption from "@/components/web/DashboardCaption";
import { Save } from "lucide-react";
import NotificationSection from "@/components/web/Notification";

export default function ProfilePage() {
  return (
    <>
      <DashboardCaption
        heading="Profile"
        text="Manage your account preferences"
      />

      <div className="p-5">
        <div className="mb-5 space-y-px">
          <h4>Profile Information</h4>
          <p className="bodyText text-muted-foreground">
            Update your personal details
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-15">
              <AvatarImage src="https://i.pravatar.cc/100" />
              <AvatarFallback>OC</AvatarFallback>
            </Avatar>

            <div className="space-y-px ">
              <p className="bodyText font-semibold">Tee</p>
              <p className="bodyText text-muted-foreground">ddk@gmail.com</p>
              <Badge variant="outline" className="-ml-2">
                Student
              </Badge>
            </div>
          </div>

          <Button
            variant={"outline"}
            size={"lg"}
            className="rounded-2xl py-2.5! px-4!"
          >
            Upload Profile Picture
          </Button>
        </div>

        <div className="flex mt-4 items-center gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="displayName">Display Name</Label>
            <Input defaultValue={"Tee Moses"} />
          </div>
          <Button className="" size={"sm"}>
            Save <Save />
          </Button>
        </div>
      </div>

      {/* notification */}

      <div className="p-5">
        <div className="mb-5 space-y-px">
          <h4>Notification</h4>
          <p className="bodyText text-muted-foreground">
            Choose how you want to be notified
          </p>
        </div>

        <NotificationSection />
      </div>
    </>
  );
}
