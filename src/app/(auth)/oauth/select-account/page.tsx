import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { auth } from "@/src/lib/auth";
import { AnotherAccountBtn, SelectAccountBtn } from "./account-button";

export const metadata: Metadata = {
  title: "Select Account",
  description: "Select account to authorize this application",
};

export default async function SelectAccountPage() {
  const sessions = await auth.api.listDeviceSessions({
    headers: await headers(),
  });
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center justify-center md:py-10">
        <div className="md:w-[400px]">
          <Card className="w-full rounded-none border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Select Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sessions.map((s, i) => (
                <SelectAccountBtn key={s.session.id ?? i} session={s} />
              ))}
            </CardContent>
            <AnotherAccountBtn />
          </Card>
        </div>
      </div>
    </div>
  );
}
