"use client"

import { useParams, useRouter } from "next/navigation";
import { ResetPasswordForm } from "../form";

export default function ResetPasswordTokenPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    return <ResetPasswordForm token={token} router={router} />
}
