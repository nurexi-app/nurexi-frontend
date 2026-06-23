import { Quote } from "lucide-react";
import Star from "../web/Star";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TestimonialProp {
  name: String;
  role: String;
  rating: number;
  avatarFallback: String;
  text: String;
}

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialProp }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shrink-0">
      <div className="flex items-center justify-between mb-6">
        <Quote className="w-6 h-6 text-grey" />

        <Star ratingNumber={testimonial.rating} className="w-6 h-6 " />
      </div>

      <p className="text-xs text-grey mb-4">{testimonial.text}</p>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 md:w-10 md:h-10">
          <AvatarImage src={"#"} />
          <AvatarFallback className="uppercase">
            {testimonial.avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">{testimonial.name}</h3>
          <p className="subText text-[#78767D4D]">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
