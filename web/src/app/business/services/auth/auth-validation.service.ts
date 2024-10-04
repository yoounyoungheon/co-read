import { z } from "zod";

export const SignUpFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const SignInFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignUpRequestBody = z.infer<typeof SignUpFormSchema>;
export type SignInRequestBody = z.infer<typeof SignInFormSchema>;