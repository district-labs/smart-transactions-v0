"use client"

import { useRef } from "react"
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import { cn } from "@/lib/utils"

import { ActiveStrategy } from "./active-strategy"
import { AssetDesignElement } from "./asset-design-element"
import { AssetElements } from "./asset-elements"

export function Canvas({ showStrategy }: { showStrategy: boolean }) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <DndContext sensors={sensors}>
      <section
        className={cn(
          "relative mx-auto h-[600px] max-w-7xl pt-12 text-sm transition-opacity duration-1000",
          showStrategy ? "opacity-100" : "opacity-0"
        )}
      >
        <AssetDesignElement
          asset={AssetElements["Ethereum"]}
          className="left-0 top-0"
        />
        <AssetDesignElement
          asset={AssetElements["Optimism"]}
          className="left-1/4 top-1/4"
        />
        <AssetDesignElement
          asset={AssetElements["ZK Sync"]}
          className="bottom-20 left-20"
        />
        <AssetDesignElement
          asset={AssetElements["Polygon"]}
          className="right-0 top-0"
        />
        <AssetDesignElement
          asset={AssetElements["Starknet"]}
          className="bottom-1/4 right-0"
        />
        {/* Strategy in the middle */}
        <div className="mx-auto flex h-full w-96 flex-col gap-2">
          <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
            <p>Layer 2 Bull Strategy</p>
          </div>
          <div className="flex items-start gap-x-2">
            <div className="relative mx-auto w-fit flex-1 rounded-md bg-green-700 px-4 py-2 text-center text-white">
              <p className="font-bold">
                WEIGHT <span className="font-normal">Equal</span>
              </p>
            </div>
            <div className="relative mx-auto w-fit flex-1 rounded-md bg-blue-700 px-4 py-2 text-center text-white">
              <p className="font-bold">
                REBALANCE <span className="font-normal">Monthly</span>
              </p>
            </div>
          </div>
          <ActiveStrategy />
        </div>
      </section>
    </DndContext>
  )
}
