import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/lib/db/schema";
import * as authSchema from "@/lib/db/auth-schema";
import { Resend } from "resend";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...schema, ...authSchema }
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    emailVerification: {
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail(user.email, url);
        }
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
})

async function sendVerificationEmail(email: string, url: string) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
        from: `Tutoria <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verifique seu endereço de e-mail',
        html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Bem-vindo ao Tutoria!</h2>
            <p>Clique no botão abaixo para confirmar seu e-mail e acessar a plataforma.</p>
            <a
            href="${url}"
            style="
                display: inline-block;
                background: #7F77DD;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 500;
                margin-top: 16px;
            "
            >
            Confirmar e-mail
            </a>
            <p style="margin-top: 24px; color: #888; font-size: 13px;">
            Se você não criou uma conta, ignore este e-mail.
            </p>
        </div>
        `,
    })
}