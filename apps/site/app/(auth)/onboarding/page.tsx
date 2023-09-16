import { cookies } from "next/headers"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

import { getRequestCookie } from "@/lib/session"
import { UpdateUserForm } from "@/components/forms/update-user-form"
import { Icons } from "@/components/icons"

export default async function OnboardingPage() {
  const session = await getRequestCookie(cookies())

  // TODO add session check
  const dbUser = await db.query.users.findFirst({
    where: eq(users.address, session!.user.address),
  })

  console.log(dbUser)

  if (!dbUser) {
    throw new Error("You shouldn't be here.")
  }

  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-none">
      <div className="space-y-2">
        <Icons.logo className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold uppercase leading-9 tracking-tight">
          Identity Details
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Enter a couple of details so we can keep you updated.
        </p>
      </div>
      <div className="mt-10 space-y-4">
        <UpdateUserForm user={dbUser} />
      </div>
    </div>
  )
}
