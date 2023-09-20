import { UpdateUserForm } from "@/components/forms/update-user-form"
import { Icons } from "@/components/icons"

export default function OnboardingPage() {
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
        <UpdateUserForm />
      </div>
    </div>
  )
}
