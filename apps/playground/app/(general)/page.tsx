"use client"

import { useState } from "react"
import {
  DeploySafe,
  EnableSafeIntentModule,
  IsSafeCounterfactual,
  IsSafeIntentModuleDisabled,
  IsSafeIntentModuleEnabled,
  IsSafeMaterialized,
  SafeDeterministicAddress,
  SignIntentBundle,
} from "@district-labs/intentify-react"
import { constants } from "ethers"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container relative mt-20 px-0">
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-bold">Safe Address:</span>{" "}
          <SafeDeterministicAddress />
        </div>
        <IsSafeCounterfactual>
          <DeploySafe>
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
            onSuccess={(res) => alert(res)}
            onError={() => alert("Rejected")}
            intentBatch={{
              nonce: {
                queue: 0,
                accumulator: 0,
              },
              intents: [
                {
                  exec: {
                    root: constants.AddressZero,
                    target: constants.AddressZero,
                    data: "0x",
                  },
                  signature: {
                    v: 0,
                    r: constants.HashZero,
                    s: constants.HashZero,
                  },
                },
              ],
            }}
          >
            <Button>Sign Intent Bundle</Button>
          </SignIntentBundle>
        </IsSafeIntentModuleEnabled>
      </div>
    </div>
  )
}
