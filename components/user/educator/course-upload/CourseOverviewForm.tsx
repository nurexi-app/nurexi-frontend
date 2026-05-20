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
import { Eye, Loader2, Plus } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateSlug } from "@/lib/utils";
import { updateCourseOverview } from "@/lib/actions/course-action";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import Image from "next/image";
import { X } from "@/components/animate-ui/icons/x";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

interface CourseOverviewFormProps {
  course: any;
}

export default function CourseOverviewForm({
  course,
}: CourseOverviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [imagePreview, setImagePreview] = useState(course?.cover_image || "");

  const form = useForm<courseOverviewType>({
    resolver: zodResolver(courseOverviewSchema),
    defaultValues: {
      title: course?.title || "",
      slug: course?.slug || "",
      description: course?.description || "",
      dificultyLevel: course?.difficulty_level || "Beginner",
      expectedDuration: course?.expected_duration || "",
      language: course?.language || "",
      learningOutcome: course?.what_you_will_learn || [],
      image: course?.cover_image || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "learningOutcome" as never,
  });

  const watchTitle = form.watch("title");
  const watchSlug = form.watch("slug");
  const watchImage = form.watch("image");

  useEffect(() => {
    if (!isManualSlug && watchTitle) {
      const generatedSlug = generateSlug(watchTitle);
      if (generatedSlug !== watchSlug) {
        form.setValue("slug", generatedSlug);
      }
    }
  }, [watchTitle, isManualSlug, watchSlug, form]);

  // Update image preview when URL changes
  useEffect(() => {
    setImagePreview(watchImage || "");
  }, [watchImage]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualSlug(true);
    form.setValue("slug", e.target.value);
  };

  const onSubmit = async (data: courseOverviewType) => {
    setIsSubmitting(true);

    const result = await updateCourseOverview(course?.id, data);

    if (result.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success("Course overview saved!");

    // Navigate to next section
    const params = new URLSearchParams(window.location.search);
    params.set("section", "course-content");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Title */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Course Title *</FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g., Introduction to Pharmacology"
                  className="h-10"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Slug */}
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Course URL Slug *</FieldLabel>
                <Input
                  {...field}
                  onChange={handleSlugChange}
                  placeholder="introduction-to-pharmacology"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  URL: nurexi.com/courses/{field.value || "your-slug"}
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Course Description *</FieldLabel>
              <Textarea
                {...field}
                rows={4}
                placeholder="What will students learn in this course?"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Difficulty & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="dificultyLevel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Difficulty Level *</FieldLabel>
                <NativeSelect {...field} className="h-10">
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
              <Field>
                <FieldLabel>Expected Duration *</FieldLabel>
                <Input {...field} placeholder="e.g., 4 weeks, 10 hours" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Language */}
        <Controller
          name="language"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Language *</FieldLabel>
              <Input {...field} placeholder="e.g., English, French" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Learning Outcomes */}
        <div className="space-y-2">
          <FieldLabel>What You Will Learn *</FieldLabel>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input
                {...form.register(`learningOutcome.${index}`)}
                placeholder="e.g., Understand basic pharmacology concepts"
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="h-10 w-10 shrink-0"
              >
                <AnimateIcon animateOnHover>
                  <X className="h-4 w-4" />
                </AnimateIcon>
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Learning Outcome
          </Button>

          {form.formState.errors.learningOutcome && (
            <FieldError errors={[form.formState.errors.learningOutcome]} />
          )}
        </div>

        {/* Course Image */}
        <div className="space-y-2">
          <FieldLabel>Course Image URL</FieldLabel>

          <div className="flex gap-4 items-start">
            <Input
              {...form.register("image")}
              placeholder="https://example.com/course-image.jpg"
              className="flex-1"
            />

            {imagePreview && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <div className="relative w-full h-64">
                    <Image
                      src={imagePreview}
                      alt="Course preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {imagePreview && (
            <div className="relative w-32 h-32 mt-2 rounded-lg overflow-hidden border">
              <Image
                src={imagePreview}
                alt="Course thumbnail"
                fill
                className="object-cover"
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Use a public image URL. Recommended size: 1280x720px
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 items-center justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save and Continue"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
