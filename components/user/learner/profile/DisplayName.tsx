"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDisplayName } from "@/lib/actions/Settings-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function DisplayName({ name }: { name: string }) {
  const schema = z.object({
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters long")
      .max(30, "Display name must be at most 30 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      displayName: name,
    },
  });

  const watchedName = form.watch("displayName");
  const isDirty = watchedName !== name;

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: { displayName: string }) => {
    try {
      startTransition(async () => {
        const res = await updateDisplayName(data.displayName);
        if (res.success) {
          toast.success("Display name updated successfully");
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="mt-4">
      <form
        className="flex flex-col gap-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Label htmlFor="displayName">Display Name</Label>
        <div className="flex items-center gap-2">
          <Input {...form.register("displayName")} className="max-w-xs" />

          <Button
            disabled={
              isPending ||
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              !isDirty
            }
            size={"sm"}
          >
            Save <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {form.formState.errors.displayName && (
          <p className="text-xs text-red-500">
            {form.formState.errors.displayName.message}
          </p>
        )}
      </form>
    </div>
  );
}
