import type { IntentBatchQuery } from "@district-labs/intentify-database"
import { Info } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Row } from "../shared/row"
import { TimeFromDate } from "../shared/time-from-date"
import { ScrollArea } from "../ui/scroll-area"
import { LimitOrderIntent } from "./limit-order-intent"
import { TimestampRangeIntent } from "./timestamp-range-intent"

type SheetIntentBatchDetails = React.HTMLAttributes<HTMLElement> & {
  data: IntentBatchQuery
}

export const SheetIntentBatchDetails = ({
  children,
  data,
}: SheetIntentBatchDetails) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-1/2 max-h-screen sm:w-[860px]">
        <ScrollArea className="max-h-[100%] overflow-auto">
          <div className="">
            <SheetHeader>
              <SheetTitle>Intent Batch Details</SheetTitle>
              <SheetDescription>
                View details about a intent batch.
              </SheetDescription>
            </SheetHeader>
            <hr className="my-4" />
            <div className="">
              <span className="">Root Smart Wallet</span>
              <h3 className="text-2xl font-semibold">{data?.root}</h3>
              <div className="mt-6 flex flex-col gap-y-2">
                <Row
                  classNameValue="font-bold"
                  label="Chain ID"
                  value={data?.chainId}
                />
                <Row
                  classNameValue="font-bold"
                  label="Executed"
                  value={
                    data.executedAt ? (
                      <TimeFromDate
                        length={1}
                        type="DATETIME"
                        date={data.executedAt}
                      />
                    ) : (
                      "Not Executed"
                    )
                  }
                />
                <Row
                  classNameValue="font-bold"
                  label="Cancelled"
                  value={
                    data.cancelledAt ? (
                      <TimeFromDate
                        length={1}
                        type="DATETIME"
                        date={data.cancelledAt}
                      />
                    ) : (
                      "Not Cancelled"
                    )
                  }
                />
                {/* <Row classNameValue="font-bold" label='Created' value={data?.createdAt?.toDateString()} /> */}
                <Row
                  classNameValue="font-bold"
                  label="Total Intents"
                  value={data.intents.length}
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-5">
              {data.intents.map((intent) => {
                if (
                  intent.intentId ===
                  "0x588617bbd20062df159d68794269d3d6318bb44bdea3a6963d146ad5aafdb0be"
                ) {
                  return (
                    <TimestampRangeIntent
                      key={intent.id}
                      epoch={String(intent?.intentArgs[0].value)}
                    />
                  )
                }
                if (
                  intent.intentId ===
                  "0xfcad8cc1884827b88c5a3753edd277a68ad6ee981f7a9dd07f82a48980ebaf94"
                ) {
                  return (
                    <LimitOrderIntent
                      key={intent.id}
                      tokenOut={String(intent?.intentArgs[0].value)}
                      amountOut={String(intent?.intentArgs[2].value)}
                      tokenIn={String(intent?.intentArgs[1].value)}
                      amountIn={String(intent?.intentArgs[3].value)}
                    />
                  )
                }
              })}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
