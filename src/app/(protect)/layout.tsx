import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { tutor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function LayoutProtegido({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/login")
  }

  if (session.user.role === "tutor") {
    const [tutorRow] = await db
      .select({ onboardingCompleto: tutor.onboardingCompleto })
      .from(tutor)
      .where(eq(tutor.userId, session.user.id))

    if (tutorRow && !tutorRow.onboardingCompleto) {
      redirect("/onboarding")
    }
  }

  return <>{children}</>
}