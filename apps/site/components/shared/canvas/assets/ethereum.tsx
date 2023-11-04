"use client"

import EthereumIcon from "@/public/assets/ethereum.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

const type: Assets = "Ethereum"

export const EthereumElement: Element = {
  designElement: {
    icon: EthereumIcon,
    label: "Ethereum",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        ETH
        <span className="ml-2 font-normal text-muted-foreground">
          Ethereum • Ethereum
        </span>
      </p>
    </div>
  )
}
