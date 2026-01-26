import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Lock } from "lucide-react";

export default function CourseContentAccordion() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Course content</h2>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="intro">
          <AccordionTrigger>Getting started</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-sm">
              <li>Welcome to the course</li>
              <li>How to use this course</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="locked-1">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Pharmacology Basics
              <Lock className="h-4 w-4 text-muted-foreground" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Enroll to unlock this section
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
