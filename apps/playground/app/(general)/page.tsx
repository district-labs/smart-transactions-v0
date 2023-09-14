"use client"

import { DeploySafe, EnableSafeIntentModule, SignIntentBundle } from "@district-labs/intentify-react"
import { constants } from "ethers"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container relative mt-20 px-0">
      <div className="flex flex-col gap-y-10">
        <DeploySafe salt={4} displaySafeAddress>
          <Button>Deploy Safe</Button>
        </DeploySafe>
        <EnableSafeIntentModule safeAddress="0x88B28dc71B7C2f11072FF41Eb82e177E7E8eb30d">
          <Button>Enable Intent Module</Button>
        </EnableSafeIntentModule>
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
      </div>
    </div>
  )
}
