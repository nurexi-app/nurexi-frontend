import Link from "next/link";
import { buttonVariants } from "../ui/button";

const TestimonialCTA = () => {
  return (
    <div className=" max-w-150 mx-auto text-center ">
      <div className="">
        <h3 className="font-medium text-2xl  ">
          Ready to take your nursing exam prep to the next level?
        </h3>
        <p className="bodyText max-w-100 mx-auto mb-4 mt-2">
          Join hundreds of nursing students who trust Nurexi for their exam
          preparation.
        </p>

        <div className="flex flex-row justify-center gap-3 w-full sm:w-auto">
          <Link
            href={"/learner"}
            className={` ${buttonVariants({
              variant: "default",
              size: "default",
            })} cta-pulse w-[47%] sm:w-auto hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200`}
          >
            Get Started
          </Link>
          <Link
            href={"/learner/exam"}
            className={`${buttonVariants({
              variant: "outline",
              size: "default",
            })}  w-[47%] sm:w-auto hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200`}
          >
            Explore exams →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCTA;
