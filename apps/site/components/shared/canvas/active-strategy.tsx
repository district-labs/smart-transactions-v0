import { useDndMonitor, useDroppable, type DragEndEvent } from "@dnd-kit/core"

import { cn } from "@/lib/utils"

import { AssetElements, type Assets } from "./asset-elements"
import useStrategy from "./useStrategy"

export function ActiveStrategy({ children }: { children?: React.ReactNode }) {
  const { elements, addElement } = useStrategy()
  const droppable = useDroppable({
    id: "canvas-drop-area",
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event
      if (!active || !over) return
      4
      const isDesignBtnElement = active.data?.current?.isDesignBtnElement

      if (isDesignBtnElement) {
        const type = active.data?.current?.type
        const newElement = AssetElements[type as Assets]

        addElement(newElement)
      }
    },
  })

  return (
    <div
      ref={droppable.setNodeRef}
      className={cn("space-y-2", droppable.isOver)}
    >
      <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
        <p className="font-bold">
          ARB
          <span className="ml-2 font-normal text-muted-foreground">
            Arbitrum • Arbitrum One
          </span>
        </p>
      </div>
      <div className="relative mx-auto w-full rounded-md bg-muted px-4 py-2">
        <p className="font-bold">
          COIN
          <span className="ml-2 font-normal text-muted-foreground">
            Coinbase • Base
          </span>
        </p>
      </div>
      {elements.map((element) => (
        <element.designComponent key={element.designElement.label} />
      ))}
      {droppable.isOver && (
        <div className="relative h-8 rounded-md bg-muted/50" />
      )}

      <div className="card mt-12 rounded-xl border-2 border-dashed border-white p-3 text-center text-white">
        <p className="text-xs">Drop tokens here</p>
      </div>
      {children}
    </div>
  )
}
