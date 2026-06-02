import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/lib/db/schema";
import * as authSchema from "@/lib/db/auth-schema";
import { Resend } from "resend";
import VerificarEmail from "@/app/components/emails/VerificarEmail";
import DeletarContaEmail from "@/app/components/emails/DeletarContaEmail";
import ResetarSenhaEmail from "@/app/components/emails/ResetarSenhaEmail";
import { deleteArquivo, uploadArquivo } from "./r2/r2";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...schema, ...authSchema }
    }),

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    if(user.role === "tutor"){
                        await db.insert(schema.tutor).values({
                            userId: user.id,
                            modalidade: "ead",
                        })
                    }
                    if(user.image && user.image.startsWith("https://lh3.googleusercontent.com")){
                        try {
                            const response = await fetch(user.image)
                            if(response.ok){
                                const buffer = Buffer.from(await response.arrayBuffer())
                                const nome = `avatars/${user.id}-${Date.now()}.jpg`
                                const contentType = response.headers.get("content-type") || "image/jpeg"
                                const url = await uploadArquivo(nome, buffer, contentType)
                                await db.update(authSchema.user).set({ image: url }).where(eq(authSchema.user.id, user.id))
                            }
                        } catch (error) {
                            console.error("Falha ao migrar foto do Google:", error)
                        }
                    }
                }
            },
            delete: {
                after: async (user) => {
                    if (user.image && user.image.startsWith(process.env.R2_PUBLIC_URL!)) {
                        const key = user.image.replace(`${process.env.R2_PUBLIC_URL}/`, "")
                        await deleteArquivo(key)
                    }
                }
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail(user.email, url, user.name);
        },
    },

    user: {
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                await sendDeleteAccountEmail(user.email, url, user.name);
            },
        },
        additionalFields: {
            telefone: {
                type: "string",
                required: false,
                input: true,
            },
            role: {
                type: "string",
                required: true,
                input: true,
                defaultValue: "aluno",
            }
        }
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        redirectTo: "/onboarding",
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

async function sendDeleteAccountEmail(email: string, url: string, name: string) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
        from: `Tutoria <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Confirme a exclusão da sua conta',
        react: <DeletarContaEmail url={url} name={name} />,
    })
}

async function sendResetPasswordEmail(email: string, url: string, name: string) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
        from: `Tutoria <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Redefina sua senha',
        react: <ResetarSenhaEmail url={url} name={name} />,
    })
}