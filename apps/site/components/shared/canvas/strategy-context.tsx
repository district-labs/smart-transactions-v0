"use client"

import { createContext, ReactNode, useState } from "react"

import { Element } from "@/components/shared/canvas/asset-elements"

type StrategyContextType = {
  elements: Element[]
  addElement: (element: Element) => void
}

export const StrategyContext = createContext<StrategyContextType | null>(null)

export default function StrategyContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [elements, setElements] = useState<Element[]>([])

  const addElement = (element: Element) => {
    setElements((prev) => {
      if (prev.includes(element)) {
        return [...prev]
      }

      const newElements = [...prev]
      newElements.push(element)
      return newElements
    })
  }

  return (
    <StrategyContext.Provider
      value={{
        elements,
        addElement,
      }}
    >
      {children}
    </StrategyContext.Provider>
  )
}
