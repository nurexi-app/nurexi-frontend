"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  courseOverviewSchema,
  courseOverviewType,
} from "@/lib/validators/courseUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useRouter } from "next/navigation";

interface CourseOverviewFormProps {
  courseId?: string | null;
}

export default function CourseOverviewForm({
  courseId,
}: CourseOverviewFormProps) {
  const form = useForm<courseOverviewType>({
    resolver: zodResolver(courseOverviewSchema),
    defaultValues: {
      title: "",
      description: "",
      dificultyLevel: "Beginner",
      expectedDuration: "",
      language: "",
      learningOutcome: [],
      image: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "learningOutcome" as never,
  });

  const router = useRouter();

  function onSubmit(data: courseOverviewType) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });

    const params = new URLSearchParams(window.location.search);
    params.set("section", "course-content");
    router.push(`?${params.toString()}`);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      id="form-overview"
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-overview-title">
                Course Title
              </FieldLabel>
              <Input
                {...field}
                id="form-overview-title"
                aria-invalid={fieldState.invalid}
                placeholder="Introduction to Pharamacology"
                className="h-9 w-full bg-primary-light placeholder:text-sm    text-muted-foreground"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-overview-description">
                Course Description
              </FieldLabel>
              <Textarea
                {...field}
                id="form-overview-description"
                aria-invalid={fieldState.invalid}
                placeholder="Description of the course"
                className="h-9 w-full bg-primary-light placeholder:text-sm    text-muted-foreground"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex items-center  gap-4 md:flex-row flex-col justify-between">
          <Controller
            name="dificultyLevel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <FieldLabel htmlFor="form-overview-dificultyLevel">
                  Difficulty Level
                </FieldLabel>
                <NativeSelect
                  id="form-overview-dificultyLevel"
                  className="w-full"
                  {...field}
                >
                  <NativeSelectOption value="Beginner">
                    Beginner
                  </NativeSelectOption>
                  <NativeSelectOption value="Intermediate">
                    Intermediate
                  </NativeSelectOption>
                  <NativeSelectOption value="Advanced">
                    Advanced
                  </NativeSelectOption>
                </NativeSelect>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="expectedDuration"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <FieldLabel htmlFor="form-overview-expectedDuration">
                  Expected Duration
                </FieldLabel>
                <Input
                  {...field}
                  id="form-overview-expectedDuration"
                  aria-invalid={fieldState.invalid}
                  placeholder="2 weeks"
                  className="h-9 w-full bg-primary-light placeholder:text-sm    text-muted-foreground"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="language"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-overview-language">Language</FieldLabel>
              <Input
                {...field}
                id="form-overview-language"
                aria-invalid={fieldState.invalid}
                placeholder="Language"
                className="h-9 w-full bg-primary-light placeholder:text-sm    text-muted-foreground"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col gap-2">
          <FieldLabel>Learning Outcomes</FieldLabel>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <Input
                {...form.register(`learningOutcome.${index}` as const)}
                placeholder="Learning Outcome"
                className="h-9 w-full bg-primary-light placeholder:text-sm text-muted-foreground"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <span className="sr-only">Remove</span>
                &times;
              </Button>
            </div>
          ))}
          {form.formState.errors.learningOutcome && (
            <FieldError errors={[form.formState.errors.learningOutcome]} />
          )}

          <div className="flex items-center gap-4">
            <Button size={"icon"} type="button" onClick={() => append("")}>
              <Plus />
            </Button>
          </div>
        </div>

        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-overview-image">
                Course Image
              </FieldLabel>
              <Input
                {...field}
                id="form-overview-image"
                aria-invalid={fieldState.invalid}
                placeholder="Course Image"
                className="h-9 w-full bg-primary-light placeholder:text-sm    text-muted-foreground"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          <Button type="submit">Save and Continue</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
