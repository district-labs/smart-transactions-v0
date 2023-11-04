"use client"

import PolygonIcon from "@/public/assets/polygon.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

const type: Assets = "Polygon"

export const PolygonElement: Element = {
  designElement: {
    icon: PolygonIcon,
    label: "Polygon",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        POL
        <span className="ml-2 font-normal text-muted-foreground">
          Polygon • Polygon zkEVM
        </span>
      </p>
    </div>
  )
}
