import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

interface SubjectProps {
  src: string;
  alt: string;
  title: string;
  questions: number;
  link: string;
}
const PracticeCard = ({ link, title, questions, src, alt }: SubjectProps) => {
  return (
    <Link
      href={`/learner/practice/${link}`}
      className="space-y-4 group/item border-[0.5px] transition duration-200 cursor-pointer bg-background hover:shadow border-secondaryLightActive rounded-[10px] p-4 pb-6"
    >
      <div className="h-12 w-12 relative">
        <Image fill src={src} alt={alt} />
      </div>
      <h3 className="text-black/90">{title}</h3>
      <div className="flex items-center text-muted-foreground!  justify-between">
        <span className="bg-secondaryLightActive px-1.75 text-xs rounded-full">
          {questions} questions
        </span>
        <MdKeyboardArrowRight className="group-hover/item:translate-x-1 transition duration-200" />
      </div>
    </Link>
  );
};

export default PracticeCard;
