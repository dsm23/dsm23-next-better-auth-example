"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignIn from "@/app/(auth)/sign-in/_components/sign-in";
import { SignUp } from "@/app/(auth)/sign-in/_components/sign-up";
import { Tabs } from "@/components/ui/tabs2";
import { authClient } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    authClient.oneTap({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || "An error occurred");
        },
        onSuccess: () => {
          toast.success("Successfully signed in");
          router.push(getCallbackURL(params));
        },
      },
    });
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center justify-center md:py-10">
        <div className="w-full max-w-md">
          <Tabs
            tabs={[
              {
                title: "Sign In",
                value: "sign-in",
                content: <SignIn />,
              },
              {
                title: "Sign Up",
                value: "sign-up",
                content: <SignUp />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
