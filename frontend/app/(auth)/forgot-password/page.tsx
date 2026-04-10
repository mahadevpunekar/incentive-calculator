import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[440px]">
      <Card className="rounded-xl border border-border/70 bg-card/90 shadow-xl shadow-black/[0.06] backdrop-blur-md dark:shadow-black/30">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-xl font-semibold">Reset password</CardTitle>
          <CardDescription className="leading-relaxed">
            Placeholder for Dhofar Insurance password recovery. Connect to your
            identity provider or NestJS flow when ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pb-8">
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
