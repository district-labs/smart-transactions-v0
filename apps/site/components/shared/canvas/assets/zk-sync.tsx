"use client"

import ZKSyncIcon from "@/public/assets/zk-sync.png"

import { Assets, Element } from "@/components/shared/canvas/asset-elements"

export const ZKSyncElement: Element = {
  designElement: {
    icon: ZKSyncIcon,
    label: "ZK Sync",
  },
  designComponent: DesignComponent,
  strategyComponent: () => <div>Strategy Component</div>,
}

function DesignComponent() {
  return (
    <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
      <p className="font-bold">
        ZKE
        <span className="ml-2 font-normal text-muted-foreground">
          ZKE • zkSync Era
        </span>
      </p>
    </div>
  )
}
