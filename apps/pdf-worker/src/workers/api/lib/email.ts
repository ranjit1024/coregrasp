import { Resend } from "resend";
import { Bindings } from "../../../shared/types";

export async function sendQuizEmail(
    env: Bindings,
    to: string,
    quizUrl: string,
    title: string
) {
    const link = `http://localhost:3000/assessment/${encodeURIComponent(quizUrl)}`;
    const from = "Coregrasp quiz.coregrasp.online"; 

    const subject = `Quiz ready: ${title}`;
    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; width: 100%; min-height: 100vh; padding: 60px 20px; box-sizing: border-box; color: #ffffff;">
        
        <!-- Inner Container (Centers the content on large screens) -->
        <div style="max-width: 600px; margin: 0 auto;">
            
            <!-- Coregrasp Branding -->
            <div style="margin-bottom: 40px;">
                <span style="font-size: 20px; font-weight: 800; letter-spacing: -1px; color: #ffffff;">Coregrasp</span>
            </div>
            
            <!-- Main Content -->
            <h2 style="color: #ffffff; font-size: 28px; font-weight: 600; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.5px;">
                Your policy assessment is ready
            </h2>
            
            <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
                A new policy comprehension quiz has been generated for <strong style="color: #ffffff; font-weight: 600;">${title}</strong>. Please take a few minutes to complete this assessment to ensure you are up to date with the latest guidelines.
            </p>
            
            <!-- Call to Action -->
            <a href="${link}" style="display: inline-block; padding: 14px 28px; background-color: #ffffff; color: #000000; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 6px; text-align: center;">
                Begin Assessment
            </a>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid #27272a; margin: 48px 0 24px 0;" />
            
            <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin: 0;">
                This assessment was securely routed via Coregrasp. You do not need an account to complete it; anyone with this unique link can access the quiz. 
            </p>
            
        </div>
    </div>
`;

    const resend = new Resend(env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
    });

    if (error) {
        return  new Error(`Resend send failed: ${error.message}`);
    }

    return data;
}
