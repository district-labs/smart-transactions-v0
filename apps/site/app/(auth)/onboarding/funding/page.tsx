// import { FundAccountForm } from "@/components/forms/fund-account-form"
import { Icons } from "@/components/icons"

export default function FundingPage() {
  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-none">
      <div className="space-y-2">
        <Icons.logo className="h-16 w-16 text-primary" />
        <h2 className="text-2xl font-bold uppercase leading-9 tracking-tight">
          Start with just $1
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          You&apos;re almost there! Let&apos;s keep your funds safe, by
          deploying a{" "}
          <a href="https://safe.global/" className="text-green-500 underline">
            SAFE Account
          </a>
        </p>
      </div>
      <div className="mt-10 space-y-4">
        {/* 
        TODO: Fix Wagmi config issue
        <FundAccountForm /> */}
      </div>
    </div>
  )
}
