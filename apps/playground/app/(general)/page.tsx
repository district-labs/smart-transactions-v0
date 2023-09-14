"use client"

import { DeploySafe, SignIntentBundle } from "@district-labs/intentify-react"
import { constants } from "ethers"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container relative mt-20 px-0">
      <div className="flex flex-col gap-y-10">
        <DeploySafe salt={4}>
          <Button>Deploy Safe</Button>
        </DeploySafe>
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
