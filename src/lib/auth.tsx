import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/lib/db/schema";
import * as authSchema from "@/lib/db/auth-schema";
import { Resend } from "resend";
import VerificarEmail from "@/app/components/emails/VerificarEmail";

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
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail(user.email, url, user.name);
        }
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
})

async function sendVerificationEmail(email: string, url: string, name: string) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
        from: `Tutoria <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verifique seu endereço de e-mail',
        react: <VerificarEmail url={url} name={name} />,
    })
}