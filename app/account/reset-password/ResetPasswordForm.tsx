"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InitializeResetPassword } from "@/lib/actions/auth";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: ResetPasswordSchema) {
    startTransition(async () => {
      try {
        await InitializeResetPassword(data);
        toast.success("Please check your email for verification", {
          description: (
            <div className="mt-2 rounded-md bg-muted p-4 text-sm">
              Please check your email for verification
            </div>
          ),
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...field}
                  type="email"
                  className="pl-8 py-2.5  h-9.5 rounded-lg bg-primary-light"
                  placeholder="you@email.com"
                />
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <span className="flex items-center gap-2">
            Sending reset link <Loader2 className="animate-spin " />
          </span>
        ) : (
          <span> Send reset link</span>
        )}
      </Button>
    </form>
  );
}
