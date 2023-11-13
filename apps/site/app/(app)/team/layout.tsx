import React from "react"

interface StrategyLayoutProps {
  children: React.ReactNode
}

export default function StrategyLayout({ children }: StrategyLayoutProps) {
  return <div className="pt-10">{children}</div>
}
