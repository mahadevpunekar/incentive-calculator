import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Use at least 8 characters"),
    useMfa: z.boolean(),
    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.useMfa) return;
    const otp = data.otp?.trim() ?? "";
    if (!/^\d{6}$/.test(otp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter the 6-digit code",
        path: ["otp"],
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
