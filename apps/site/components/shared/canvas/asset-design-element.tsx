import Image from "next/image"
import { useDraggable } from "@dnd-kit/core"

import { cn } from "@/lib/utils"

import { Element } from "./asset-elements"

export function AssetDesignElement({
  asset,
  className,
}: {
  asset: Element
  className?: string
}) {
  const { icon, label } = asset.designElement
  const draggable = useDraggable({
    id: `design-btn-${label}`,
    data: {
      type: asset.designElement.label,
      isDesignBtnElement: true,
    },
  })
  const style = draggable.transform
    ? {
        transform: `translate3d(${draggable.transform.x}px, ${draggable.transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={draggable.setNodeRef}
      style={style}
      {...draggable.listeners}
      {...draggable.attributes}
      className={cn(
        "absolute z-10 flex animate-pulse cursor-grab flex-col items-center",
        className
      )}
    >
      <Image src={icon} alt={label} width={75} height={75} />
      <span className="mt-1 text-xs font-medium text-white">Add {label}</span>
    </div>
  )
}
