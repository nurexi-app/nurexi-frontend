import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export default function CourseContentForm() {
  return (
    <form>
      <FieldGroup>
        <Field>
          <FieldLabel>Course Content</FieldLabel>
          <Textarea />
        </Field>
      </FieldGroup>
    </form>
  );
}
