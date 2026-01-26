"use client";

import { useState } from "react";
import Link from "next/link";
import { ForgetPasswordForm } from "@/src/components/forms/forget-password-form";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Page() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                If you don't see the email, check your spam folder.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/sign-in">
              <Button variant="link" className="gap-2 px-0">
                <ArrowLeft size={15} />
                Back to sign in
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgetPasswordForm onSuccess={() => setIsSubmitted(true)} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/sign-in">
            <Button variant="link" className="gap-2 px-0">
              <ArrowLeft size={15} />
              Back to sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
