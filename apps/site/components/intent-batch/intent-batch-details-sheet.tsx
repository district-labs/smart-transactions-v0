import { useEffect, useState } from "react"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import { transformIntentQueryToIntentBatchStruct } from "@/data/transforms/transform-intent-query-to-intent-batch-struct"
import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"
import type { IntentModuleDecoded } from "@district-labs/intentify-intent-batch"
import { ScrollArea } from "@district-labs/ui-react"

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
import { IntentBatchNonceType } from "./intent-batch-nonce-type"
import { IntentModuleDecodedCard } from "./intent-module-decoded-card"

type SheetIntentBatchDetails = React.HTMLAttributes<HTMLElement> & {
  data: DbIntentBatchWithRelations
}

export const SheetIntentBatchDetails = ({
  children,
  data,
}: SheetIntentBatchDetails) => {
  const [intentBatchDecoded, setIntentBatchDecoded] = useState<any>()
  useEffect(() => {
    const intentBatchTransform = transformIntentQueryToIntentBatchStruct(data)
    const intentBatch =
      intentBatchFactory.decodeIntentBatch(intentBatchTransform)
    setIntentBatchDecoded(intentBatch)
  }, [data])

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-1/2 max-h-screen sm:w-[860px]">
        <ScrollArea className="max-h-[100%] overflow-auto">
          <div className="">
            <SheetHeader>
              <SheetTitle>Smart Transaction Details</SheetTitle>
              <SheetDescription>
                Information about a smart transaction.
              </SheetDescription>
            </SheetHeader>
            <hr className="my-4" />
            <div className="">
              <div className="mt-6 flex flex-col gap-y-2">
                <Row
                  classNameValue="font-medium text-sm"
                  classNameLabel="text-sm"
                  label="Chain ID"
                  value={data?.chainId}
                />
                <Row
                  classNameValue="font-medium text-sm"
                  classNameLabel="text-sm"
                  label="Nonce"
                  value={
                    <IntentBatchNonceType
                      nonce={data?.nonce as `0x${string}`}
                    />
                  }
                />
                <Row
                  classNameValue="font-medium text-sm"
                  classNameLabel="text-sm"
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
                <Row
                  classNameValue="font-medium text-sm"
                  classNameLabel="text-sm"
                  label="Intent Module Count"
                  value={data?.intents?.length}
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-5">
              {intentBatchDecoded?.map(
                (intent: IntentModuleDecoded, index: number) => (
                  <IntentModuleDecodedCard key={index} data={intent} />
                )
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
