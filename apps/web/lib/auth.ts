// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import prisma from "./prisma";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = "CoreGrasp <quiz@quiz.coregrasp.online>";


const theme = {
  bg: "#09090b",
  cardBg: "#121214",
  border: "#27272a",
  textMain: "#fafafa",
  textMuted: "#a1a1aa",
  emerald: "#34d399",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
};


const logoHtml = `
  <div style="margin-bottom: 32px; font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
    <span style="color: ${theme.textMain};">Core</span><span style="color: ${theme.emerald};">Grasp</span>
  </div>
`;

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
      if (!resend) return;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Reset your CoreGrasp password",
        html: `
          <div style="font-family: ${theme.fontFamily}; background-color: ${theme.bg}; padding: 40px 20px; text-align: center; color: ${theme.textMain};">
            <div style="max-width: 480px; margin: 0 auto; background-color: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 40px 32px; text-align: left;">
              ${logoHtml}
              <h1 style="font-size: 24px; margin: 0 0 16px 0; font-weight: 600;">Reset your password</h1>
              <p style="color: ${theme.textMuted}; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                Hi ${user.name || "there"},<br><br>
                We received a request to reset your password for your CoreGrasp account. This link will expire in 1 hour.
              </p>
              <a href="${url}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin-bottom: 32px;">
                Reset Password
              </a>
              <hr style="border: 0; border-top: 1px solid ${theme.border}; margin: 0 0 24px 0;">
              <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin: 0;">
                If you didn't request a password reset, you can safely ignore this email. Your account is secure.
              </p>
            </div>
          </div>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      if (!resend) return;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Verify your CoreGrasp email",
        html: `
          <div style="font-family: ${theme.fontFamily}; background-color: ${theme.bg}; padding: 40px 20px; text-align: center; color: ${theme.textMain};">
            <div style="max-width: 480px; margin: 0 auto; background-color: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 40px 32px; text-align: left;">
              ${logoHtml}
              <h1 style="font-size: 24px; margin: 0 0 16px 0; font-weight: 600;">Verify your email</h1>
              <p style="color: ${theme.textMuted}; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                Hi ${user.name || "there"},<br><br>
                Welcome to CoreGrasp! Please verify your email address to complete your account setup and access your workspace.
              </p>
              <a href="${url}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin-bottom: 32px;">
                Verify Email Address
              </a>
              <hr style="border: 0; border-top: 1px solid ${theme.border}; margin: 0 0 24px 0;">
              <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin: 0;">
                You're receiving this because you created an account on CoreGrasp. If you didn't do this, please ignore this email.
              </p>
            </div>
          </div>
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