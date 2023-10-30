import * as React from "react"

type PassFormIntentBatchState = React.HTMLAttributes<HTMLElement> & {
  intentBatchState: any
  setIntentBatchState: (data: any) => void
}

export const PassFormIntentBatchState = ({
  intentBatchState,
  setIntentBatchState,
}: PassFormIntentBatchState) => {
  React.useEffect(() => {
    setIntentBatchState(intentBatchState)
  }, [intentBatchState, setIntentBatchState])

  return null
}
