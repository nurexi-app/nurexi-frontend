import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Authentication error</CardTitle>
          <CardDescription>
            Something went wrong while trying to sign you in.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            This could be due to incorrect credentials, an unverified email, or
            a temporary issue. Please try again.
          </p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Back to login</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/signup">Create an account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
