"use client"

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordForm } from "./form";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";

    if (!token) {
        return (
            <main className="bg-background min-h-screen flex flex-col items-center p-2">
                <div className="flex flex-col items-center justify-center mt-10">
                    <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                        Link inválido
                    </h1>
                </div>
                <section className="w-full max-w-md border border-border rounded-2xl p-8 bg-background mt-8 shadow text-center">
                    <p className="text-foreground text-sm">
                        Este link de redefinição de senha é inválido ou expirou.
                    </p>
                </section>
            </main>
        )
    }

    return <ResetPasswordForm token={token} router={router} />
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordContent />
        </Suspense>
    )
}
