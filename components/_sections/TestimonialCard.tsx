import { Quote } from "lucide-react";
import Star from "../web/Star";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const TestimonialCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shrink-0">
      <div className="flex items-center justify-between mb-6">
        <Quote className="w-6 h-6 text-grey" />

        {/* R */}

        <Star ratingNumber={5} className="w-6 h-6 " />
      </div>

      <p className="text-xs text-grey mb-4">
        "I love the practice questions on Nurexi! They helped me prepare
        thoroughly for my exams. The explanations are clear and easy to
        understand."
      </p>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 md:w-10 md:h-10">
          <AvatarImage src={"#"} />
          <AvatarFallback className="uppercase">
            {"og"?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">John Doe</h3>
          <p className="subText text-[#78767D4D]">Student</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
