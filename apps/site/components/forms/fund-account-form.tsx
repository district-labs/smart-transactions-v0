"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/db/schema"
import {
  DeploySafe,
  EnableSafeIntentModule,
  IsSafeCounterfactual,
  IsSafeIntentModuleDisabled,
  IsSafeIntentModuleEnabled,
  IsSafeMaterialized,
  SafeDeterministicAddress,
  SignIntentBundle,
  useGetSafeAddress,
} from "@district-labs/intentify-react"

import { siteConfig } from "@/config/site"
import { catchError } from "@/lib/utils"
import { updateUserAction } from "@/app/_actions/user"

import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

interface FundAccountFormProps {
  user: User
}

export function FundAccountForm({ user }: FundAccountFormProps) {
  const router = useRouter()
  const safeAddress = useGetSafeAddress()
  const [isPending, startTransition] = useTransition()

  function onDeploySafe() {
    startTransition(async () => {
      try {
        // Action breaking
        await updateUserAction({
          ...user,
          safeAddress,
        })

        toast({
          description: "Safe deployed successfully.",
        })
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <div className="grid gap-2">
      <p>
        TODO: Funding Buttons - Direct transfer (existing wallet) or buy via
        MoonPay / Sardine
      </p>
      <IsSafeCounterfactual>
        <DeploySafe onSuccess={onDeploySafe}>
          <Button>Deploy Safe</Button>
        </DeploySafe>
      </IsSafeCounterfactual>
      <IsSafeMaterialized>
        <IsSafeIntentModuleDisabled>
          <div className="">Intent module is disabled</div>
          <EnableSafeIntentModule
            signMessageComponent={
              <Button>Sign Module Enable Transaction </Button>
            }
            signTransactionComponent={
              <Button>Execute Enable Transaction</Button>
            }
            safeAddress="0x88B28dc71B7C2f11072FF41Eb82e177E7E8eb30d"
          />
        </IsSafeIntentModuleDisabled>
      </IsSafeMaterialized>
      <IsSafeIntentModuleEnabled>
        <SignIntentBundle
          onSuccess={onDeploySafe}
          onError={() => alert("Rejected")}
          intentBatch={{
            nonce: {
              queue: 0,
              accumulator: 0,
            },
            intents: [
              {
                exec: {
                  root: "0x0000000000000000000000000000000000000000",
                  target: "0x0000000000000000000000000000000000000000",
                  data: "0x",
                },
                signature: {
                  v: 0,
                  r: "0x0000000000000000000000000000000000000000000000000000000000000000",
                  s: "0x0000000000000000000000000000000000000000000000000000000000000000",
                },
              },
            ],
          }}
        >
          <Button>Sign Intent Bundle</Button>
        </SignIntentBundle>
      </IsSafeIntentModuleEnabled>
      <Button onClick={() => router.push(siteConfig.onboardingSteps[2].href)}>
        Next
      </Button>
    </div>
  )
}
