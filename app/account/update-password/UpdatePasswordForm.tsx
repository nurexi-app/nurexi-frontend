"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UpdatePassword } from "@/lib/actions/auth";
import {
  UpdatePasswordSchema,
  updatePasswordSchema,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const passwordRequirements = [
  { id: 1, label: "At least 8 characters long" },
  { id: 2, label: "At least one uppercase letter" },
  { id: 3, label: "At least one number" },
];

export default function UpdatePasswordForm() {
  const form = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");
  const checks = {
    minLength: passwordValue.length >= 8,
    hasUppercase: /[A-Z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
  };

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: UpdatePasswordSchema) {
    startTransition(async () => {
      try {
        await UpdatePassword(data.confirmPassword);
        toast.success("password reset successfully", {
          description: (
            <div className="mt-2 rounded-md bg-muted p-4 text-sm">
              Please login with your new password
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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  className="pl-8 py-2.5  h-9.5 rounded-lg bg-primary-light pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Confirm Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-8 py-2.5  h-9.5 rounded-lg bg-primary-light pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="space-y-2">
        {passwordRequirements.map((requirement) => {
          const isMet =
            (requirement.id === 1 && checks.minLength) ||
            (requirement.id === 2 && checks.hasUppercase) ||
            (requirement.id === 3 && checks.hasNumber);
          return (
            <div
              key={requirement.id}
              className={`flex items-center text-xs  gap-1 ${isMet ? "text-green-500" : "text-muted-foreground"}`}
            >
              <CheckCircle2 size={14} />
              <p className="">{requirement.label}</p>
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <span className="flex items-center gap-2">
            Updating password <Loader2 className="animate-spin " />{" "}
          </span>
        ) : (
          <span> Update password</span>
        )}
      </Button>
    </form>
  );
}
