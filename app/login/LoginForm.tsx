"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

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
import { loginSchema } from "@/lib/validators/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthenticateWithGoogle,
  AuthenticateWithX,
  Login,
} from "../../lib/actions/auth";

type loginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",

      rememberMe: false,
    },
  });

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: loginFormValues) {
    startTransition(async () => {
      try {
        await Login(data);
        toast.success("success", {
          description: <p className="bodyText">Welcome back</p>,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("NEXT_REDIRECT")) {
            return;
          }
          toast.error("Error", {
            description: <p className="bodyText">{error.message}</p>,
          });
        } else {
          toast.error("Error", {
            description: <p className="bodyText">Something went wrong</p>,
          });
        }
      }
    });
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full ">
      <CardContent className="pt-6">
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
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

              <Link
                className="hover:underline text-muted-foreground text-xs"
                href={"/account/reset-password"}
              >
                Forgotten password?
              </Link>
            </div>
          </FieldGroup>

          <Button type="submit" className="w-full">
            {isPending ? (
              <span className="flex items-center gap-2">
                Logging in <Loader2 className="animate-spin " />{" "}
              </span>
            ) : (
              <span> Login</span>
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
              variant="outline"
              type="button"
              onClick={async () => await AuthenticateWithGoogle()}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={async () => await AuthenticateWithX()}
            >
              <FaXTwitter className="mr-2 h-4 w-4" />X
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
