import { Resend } from "resend";
import { Bindings } from "../../../shared/types";

export async function sendQuizEmail(
  env: Bindings,
  to: string,
  quizUrl: string,
  title: string
) {
  const baseUrl = "https://coregrasp.vercel.app";
  const link = `${baseUrl}/assessment/${encodeURIComponent(quizUrl)}`;
  const from = "Coregrasp <quiz@quiz.coregrasp.online>";
  const subject = `Quiz Ready: ${title}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      
      <!-- Outer Wrapper -->
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; width: 100%;">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            
            <!-- Main Content Card -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #121215; border: 1px solid #27272a; border-radius: 12px; text-align: left; overflow: hidden;">
              <tr>
                <td style="padding: 40px 32px;">
                  
                  <!-- Header: Logo & Badge -->
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                    <tr>
                      <td align="left">
                        <span style="font-size: 18px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff;">Coregrasp</span>
                      </td>
                      <td align="right">
                        <span style="font-size: 12px; font-weight: 500; color: #a1a1aa; background-color: #27272a; padding: 4px 10px; border-radius: 9999px;">Assessment</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Main Heading -->
                  <h1 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 16px 0; letter-spacing: -0.4px; line-height: 1.3;">
                    Your policy assessment is ready
                  </h1>
                  
                  <!-- Message Body -->
                  <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                    A new policy comprehension quiz has been generated for <strong style="color: #ffffff; font-weight: 600;">Policy Assessment</strong>. Please take a few minutes to complete this assessment to ensure you are up to date with the latest guidelines.
                  </p>
                  
                  <!-- Action Button -->
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                    <tr>
                      <td align="center" style="border-radius: 6px; background-color: #ffffff;">
                        <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #000000; text-decoration: none; border-radius: 6px;">
                          Begin Assessment &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback URL Container -->
                  <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 12px 16px; margin-bottom: 32px;">
                    <p style="color: #71717a; font-size: 12px; line-height: 1.4; margin: 0 0 4px 0;">
                      Having trouble with the button? Copy and paste this link into your browser:
                    </p>
                    <a href="${link}" style="color: #38bdf8; font-size: 12px; text-decoration: underline; word-break: break-all;">
                      ${link}
                    </a>
                  </div>

                  <!-- Horizontal Divider -->
                  <div style="height: 1px; background-color: #27272a; margin-bottom: 24px;"></div>
                  
                  <!-- Footer Security Note -->
                  <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 0;">
                    This assessment was securely routed via Coregrasp. You do not need an account to complete it; anyone with this unique link can access the quiz.
                  </p>
                  
                </td>
              </tr>
            </table>

            <!-- Sub-footer -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; margin-top: 24px;">
              <tr>
                <td align="center" style="color: #52525b; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} Coregrasp. All rights reserved.
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  const resend = new Resend(env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return data;
}