"use client"

import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"

import { Button } from "../ui/button"

export function FundAccountForm() {
  const router = useRouter()

  return (
    <>
      <p>
        TODO: Funding Buttons - Direct transfer (existing wallet) or buy via MoonPay /
        Sardine
      </p>
      <Button onClick={() => router.push(siteConfig.onboardingSteps[2].href)}>
        Next
      </Button>
    </>
  )
}
