import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { BadgeCheck } from "../animate-ui/icons/badge-check";

export default function InstructorCard({
  author,
}: {
  author: {
    full_name: string;
    avatar_url: string;
    bio: string;
    professional_title: string;
    verification: {
      status: string;
    }[];
  };
}) {
  const isVerified =
    author.verification.length > 0 &&
    author.verification[0].status === "approved";
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">About the instructor</h3>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={author.avatar_url} />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-1 font-medium">
            <p>{author.full_name}</p>
            {isVerified && (
              <BadgeCheck animateOnView className="h-4 w-4 text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {author?.professional_title}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{author?.bio}</p>
    </Card>
  );
}
