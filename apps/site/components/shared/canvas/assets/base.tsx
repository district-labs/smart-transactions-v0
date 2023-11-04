"use client"

import BaseIcon from "@/public/assets/base.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

export const BaseElement: Element = {
  designElement: {
    icon: BaseIcon,
    label: "Base",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        COIN
        <span className="ml-2 font-normal text-muted-foreground">
          Coinbase • Base
        </span>
      </p>
    </div>
  )
}
