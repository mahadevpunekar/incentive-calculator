"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockUser } from "@/lib/mock-api/data";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  team: z.string().min(2),
});

type Values = z.infer<typeof schema>;

export default function ProfilePage() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      team: mockUser.team ?? "",
    },
  });

  function onSubmit(data: Values) {
    toast.success("Profile updated (mock)", {
      description: `${data.name} · ${data.email}`,
    });
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Profile & settings"
        description="Personal details, assigned targets, and notification preferences. RBAC is enforced at route guards when auth lands."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              React Hook Form + Zod validation pattern for production forms.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-lg"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work email</FormLabel>
                      <FormControl>
                        <Input autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-none h-fit">
          <CardHeader>
            <CardTitle>Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Role</p>
              <p className="font-medium capitalize">{mockUser.role}</p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground text-xs">Notifications</p>
              <p className="text-muted-foreground leading-relaxed">
                Email digests and in-app alerts will map to user preference
                endpoints.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
