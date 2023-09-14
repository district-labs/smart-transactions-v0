import Link from "next/link"
import { db } from "@/db"
import { users } from "@/db/schema"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"

import { siteConfig } from "@/config/site"
import { UpdateUserForm } from "@/components/forms/update-user-form"
import { Icons } from "@/components/icons"

// TODO: Fix getting the connected wallet to fetch user
export default async function OnboardingPage() {
  const user = await db.query.users.findFirst({
    where: eq(users.address, "0x698B963E13c12Ee7fC24258F04667b30aD1ceC13"),
  })

  if (!user) {
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
        <UpdateUserForm user={user} />
      </div>
    </div>
  )
}
