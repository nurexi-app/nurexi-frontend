"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

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
import { useState } from "react";

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

  function onSubmit(data: SignupFormValues) {
    toast.success("Signup payload", {
      description: (
        <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      ),
    });
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card className="w-full ">
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

          <Button type="submit" className="w-full">
            Sign up
          </Button>

          {/* Separator */}
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button">
              <FcGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <Button variant="outline" type="button">
              <FaXTwitter className="mr-2 h-4 w-4" />X
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
