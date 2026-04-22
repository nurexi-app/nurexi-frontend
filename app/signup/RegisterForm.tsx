"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signupSchema } from "@/lib/validators/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useState, useTransition } from "react";
import {
  AuthenticateWithGoogle,
  AuthenticateWithX,
  SignUp,
} from "../../lib/actions/auth";

type SignupFormValues = z.infer<typeof signupSchema>;

export function RegisterForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: SignupFormValues) {
    startTransition(async () => {
      try {
        const payload = {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        };

        await SignUp(payload);
        toast.success("Account created successfully", {
          description: (
            <div className="mt-2 rounded-md bg-muted p-4 text-sm">
              Please check your email for verification
            </div>
          ),
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("NEXT_REDIRECT")) {
            return;
          }

          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card className="w-full   ">
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Full Name */}
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Full Name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      className="pl-8 py-2.5  h-9.5 rounded-lg bg-primary-light"
                      placeholder="Ochife Ogechukwu"
                    />
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

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
                      autoComplete="new-password"
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

            {/* Remember Me */}
            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="cursor-pointer"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm">Remember me</span>
                </div>
              )}
            />
          </FieldGroup>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <span className="flex items-center gap-2">
                Signing up <Loader2 className="animate-spin " />{" "}
              </span>
            ) : (
              <span> Sign up</span>
            )}
          </Button>

          {/* Separator */}
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              onClick={async () => await AuthenticateWithGoogle()}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              <span className="hidden md:inline-block">
                Continue with Google
              </span>
              <span className="md:hidden">Google</span>
            </Button>

            <Button
              disabled={isPending}
              variant="outline"
              onClick={async () => await AuthenticateWithX()}
              type="button"
            >
              <FaXTwitter className="mr-2 h-4 w-4" />X
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
