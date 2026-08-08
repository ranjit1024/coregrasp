// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { Resend } from "resend";
import prisma from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = "Coregrasp <quiz@quiz.coregrasp.online>";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL, 
  trustedOrigins: [process.env.BETTER_AUTH_URL!],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Reset your CoreGrasp password",
        html: `
          <p>Hi ${user.name || ""},</p>
          <p>Click below to reset your password. This link expires in 1 hour.</p>
          <p><a href="${url}">Reset Password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Verify your CoreGrasp email",
        html: `
          <p>Hi ${user.name || ""},</p>
          <p>Click below to verify your email address.</p>
          <p><a href="${url}">Verify Email</a></p>
        `,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },


  rateLimit: {
    enabled: true,
    window: 60,
    max: 5, 
  },
});