"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fakeLogin } from "@/lib/auth/fake-login";
import { loginSchema, type LoginFormValues } from "@/lib/auth/login-schema";
import { cn } from "@/lib/utils";

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      useMfa: false,
      otp: "",
    },
  });

  const useMfa = form.watch("useMfa");
  const { isSubmitting } = form.formState;

  async function onSubmit(values: LoginFormValues) {
    try {
      await fakeLogin({
        email: values.email,
        password: values.password,
        useMfa: values.useMfa,
        otp: values.useMfa ? values.otp : undefined,
      });
      toast.success("Signed in", { description: "Redirecting to your workspace." });
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Could not sign in", {
        description: "Check your details and try again.",
      });
    }
  }

  return (
    <Card
      className={cn(
        "w-full rounded-xl border border-border/70 bg-card/90 shadow-xl shadow-black/[0.06] backdrop-blur-md dark:border-border/50 dark:shadow-black/30",
        className
      )}
    >
      <CardHeader className="space-y-3 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Use your Dhofar Insurance work email to access the incentive
            workspace.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-8 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      className="h-11 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="h-11 rounded-lg pr-11"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useMfa"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => {
                        field.onChange(v === true);
                        if (v !== true) {
                          form.setValue("otp", "");
                          form.clearErrors("otp");
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer font-medium">
                      Sign in with MFA
                    </FormLabel>
                    <FormDescription className="text-xs leading-relaxed">
                      Optional — shows a one-time code field for UI review.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {useMfa ? (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>One-time code</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        maxLength={6}
                        className="h-11 rounded-lg tracking-[0.35em] font-mono text-center text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Mock field — any 6 digits pass validation when MFA is on.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full rounded-lg text-sm font-medium shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
