export {}

export type StrategyChildrenCallback = {
  intentBatch: any
  handleGenerateIntentBatch: () => Promise<void>
}
