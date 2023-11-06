"use client"

import { useContext } from "react"

import { StrategyContext } from "./strategy-context"

function useStrategy() {
  const context = useContext(StrategyContext)

  if (!context) {
    throw new Error("useStrategy must be used within a DesignerContext")
  }

  return context
}

export default useStrategy
