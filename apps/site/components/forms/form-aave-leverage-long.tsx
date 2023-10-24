/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import {
  strategyLeverageLongForm,
  useStrategyLeverageLong,
} from "@/data/strategies_archive/leverage-long"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function FormAaveLeverageLongIntent() {
  const [intentBatch, setIntentBatch] = useStrategyLeverageLong()

  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        <div className="grid grid-cols-2 gap-8">
          {strategyLeverageLongForm.aaveLeverageLong.SupplyToken(
            intentBatch,
            setIntentBatch
          )}
          {strategyLeverageLongForm.aaveLeverageLong.BorrowToken(
            intentBatch,
            setIntentBatch
          )}
        </div>
        {strategyLeverageLongForm.aaveLeverageLong.MinHealthFactor(
          intentBatch,
          setIntentBatch
        )}
        {strategyLeverageLongForm.aaveLeverageLong.InterestRateMode(
          intentBatch,
          setIntentBatch
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3">
        <Button className="w-full">Save Intent</Button>
      </CardFooter>
    </Card>
  )
}
