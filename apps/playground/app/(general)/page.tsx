"use client"

import {
  CancelIntentBundle,
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

const intentBatchExample = {
  root: constants.AddressZero,
  nonce: "0x0000000000000000000000000000000000000000000000000000000000000000",
  intents: [
    {
      root: constants.AddressZero,
      target: constants.AddressZero,
      value: BigInt(0),
      data: "0x",
    },
  ],
}

export default function HomePage() {
  return (
    <div className="container relative mt-20 px-0">
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-bold">Safe Address:</span>{" "}
          <SafeDeterministicAddress />
        </div>
        <IsSafeCounterfactual>
          <DeploySafe salt={BigInt(0)}>
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
              safeAddressOverride="0x88B28dc71B7C2f11072FF41Eb82e177E7E8eb30d"
            />
          </IsSafeIntentModuleDisabled>
        </IsSafeMaterialized>
        <IsSafeIntentModuleEnabled>
          <div className="flex gap-x-10">
            <SignIntentBundle
              loadingComponent={<Button type="button">Signing...</Button>}
              onSuccess={(res: any) => alert(res)}
              onError={() => alert("Rejected")}
              intentBatch={intentBatchExample}
            >
              <Button>Sign Intent Bundle</Button>
            </SignIntentBundle>
            <CancelIntentBundle
              loadingComponent={<Button type="button">Loading...</Button>}
              signMessageComponent={
                <Button type="button">Approve Intent Cancel</Button>
              }
              signTransactionComponent={
                <Button type="button">Execute Intent Cancel</Button>
              }
              intentBatch={intentBatchExample}
            >
              <Button>Cancel Intent Bundle</Button>
            </CancelIntentBundle>
          </div>
        </IsSafeIntentModuleEnabled>
      </div>
    </div>
  )
}
