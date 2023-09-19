"use client"

import { useRouter } from "next/navigation"
import {
  DeploySafe,
  EnableSafeIntentModule,
  SignIntentBundle,
  useGetSafeAddress,
  useIsSafeIntentModuleEnabled,
  useIsSafeMaterialized,
} from "@district-labs/intentify-react"
import { useAccount } from "wagmi"

import { siteConfig } from "@/config/site"
import { catchError, cn } from "@/lib/utils"
import { updateUserAction } from "@/app/_actions/user"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { toast } from "../ui/use-toast"

export function FundAccountForm() {
  const router = useRouter()
  const { address } = useAccount()
  const safeAddress = useGetSafeAddress()
  const isSafeDeployed = useIsSafeMaterialized()
  const isModuleEnabled = useIsSafeIntentModuleEnabled()

  async function onDeploySafe() {
    try {
      await updateUserAction({
        safeAddress,
        address: address as string,
      })

      toast({
        description: "Safe deployed successfully.",
      })
    } catch (err) {
      catchError(err)
    }
  }

  // TODO: Funding Buttons - Direct transfer (existing wallet) or buy via MoonPay / Sardine
  // TODO: Loading States for transactions
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-row items-center justify-between rounded-lg border p-4",
          isSafeDeployed && "border-primary"
        )}
      >
        <div className="space-y-0.5">
          <Label>Deploy SAFE Account</Label>
          <p className="text-xs text-muted-foreground">
            Keep your funds safe, in an account only you control.
          </p>
        </div>
        {isSafeDeployed ? (
          <Icons.check className="h-5 w-5 text-primary" />
        ) : (
          <DeploySafe onSuccess={onDeploySafe}>
            <Button>Deploy</Button>
          </DeploySafe>
        )}
      </div>
      <div
        className={cn(
          "flex flex-row items-center justify-between rounded-lg border p-4",
          isModuleEnabled && "border-primary"
        )}
      >
        <div className="space-y-0.5">
          <Label>Install District Intent Module</Label>
          <p className="text-xs text-muted-foreground">
            Lorem ipsum. Some description.
          </p>
        </div>
        {isModuleEnabled ? (
          <Icons.check className="h-5 w-5 text-primary" />
        ) : (
          <EnableSafeIntentModule
            signMessageComponent={
              <Button disabled={!isSafeDeployed}>Sign</Button>
            }
            signTransactionComponent={
              <Button disabled={!isSafeDeployed}>Install</Button>
            }
            safeAddress="0x88B28dc71B7C2f11072FF41Eb82e177E7E8eb30d"
          />
        )}
      </div>
      <div
        className={cn(
          "flex flex-row items-center justify-between rounded-lg border p-4",
          isModuleEnabled && "border-primary"
        )}
      >
        <div className="space-y-0.5">
          <Label>Enable District Intent Module</Label>
          <p className="text-xs text-muted-foreground">
            Enable&apos;s your SAFE account to interact with the District Intent
            Protocol.
          </p>
        </div>
        {/* TODO: Add a check for if it is enabled & signed. */}
        {isModuleEnabled ? (
          <Icons.check className="h-5 w-5 text-primary" />
        ) : (
          <SignIntentBundle
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
            <Button disabled={!isModuleEnabled}>Enable</Button>
          </SignIntentBundle>
        )}
      </div>
      <div className="div flex w-full justify-end p-4">
        <Button
          onClick={() => router.push(siteConfig.onboardingSteps[2].href)}
          disabled={!isSafeDeployed || !isModuleEnabled}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
