"use client"

import OptimismIcon from "@/public/assets/optimism.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

export const OptimismElement: Element = {
  designElement: {
    icon: OptimismIcon,
    label: "Optimism",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        OP
        <span className="ml-2 font-normal text-muted-foreground">
          Optimism • Optimism
        </span>
      </p>
    </div>
  )
}
