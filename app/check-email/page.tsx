import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We’ve sent you a confirmation link to complete your registration.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Please open your inbox and click the verification link. You won’t be
            able to log in until your email is confirmed.
          </p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Back to login</Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Didn’t receive the email? Check your spam folder.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
