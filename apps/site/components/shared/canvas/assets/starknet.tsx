"use client"

import StarknetIcon from "@/public/assets/starknet.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

const type: Assets = "Starknet"

export const StarknetElement: Element = {
  designElement: {
    icon: StarknetIcon,
    label: "Starknet",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        STRK
        <span className="ml-2 font-normal text-muted-foreground">
          Starknet • Starknet zkEVM
        </span>
      </p>
    </div>
  )
}
