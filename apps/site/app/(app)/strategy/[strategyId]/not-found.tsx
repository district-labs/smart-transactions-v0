import { ErrorCard } from "@/components/cards/error-card"

export default function StrategyNotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ErrorCard
        title="Strategy not found"
        description="We couldn't find the requested strategy"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </div>
  )
}
