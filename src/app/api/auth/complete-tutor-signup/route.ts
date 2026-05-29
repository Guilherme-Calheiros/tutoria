import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import * as authSchema from "@/lib/db/auth-schema"
import * as schema from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL))
    }

    const user = session.user

    await db.update(authSchema.user)
        .set({ role: "tutor" })
        .where(eq(authSchema.user.id, user.id))

    await db.insert(schema.tutor).values({
        userId: user.id,
        modalidade: "ead",
    })

    return NextResponse.redirect(new URL("/onboarding", process.env.NEXT_PUBLIC_APP_URL))
}
