"use client"

import ArbitrumIcon from "@/public/assets/arbitrum.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

const type: Assets = "Arbitrum"

export const ArbitrumElement: Element = {
  designElement: {
    icon: ArbitrumIcon,
    label: "Arbitrum",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        ARB
        <span className="ml-2 font-normal text-muted-foreground">
          Arbitrum • Arbitrum One
        </span>
      </p>
    </div>
  )
}
