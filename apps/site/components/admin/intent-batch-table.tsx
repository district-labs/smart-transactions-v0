import type { DBIntentBatchActiveItem } from "@/db/queries/intent-batch"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LimitOrderIntent } from "@/components/intents/limit-order-intent"
import { TimestampBeforeIntent } from "@/components/intents/timestamp-before-intent"
import { TokenReleaseIntent } from "@/components/intents/token-release-intent"
import { Row } from "@/components/shared/row"
import { TimeFromDate } from "@/components/shared/time-from-date"

import { Address } from "../blockchain/address"

type IntentBatchTable = {
  data: DBIntentBatchActiveItem[]
}

export function IntentBatchTable({ data }: IntentBatchTable) {
  return (
    <Table>
      <TableHeader className="bg-neutral-50">
        <TableRow>
          <TableHead>Chain</TableHead>
          <TableHead>Intent Batch Hash</TableHead>
          <TableHead>Smart Wallet</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Intent Count</TableHead>
          <TableHead>Executed At</TableHead>
          <TableHead>Cancelled At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((intentBatch) => (
          <TableRow key={intentBatch.id}>
            <TableCell>{intentBatch.chainId}</TableCell>
            <TableCell>{intentBatch.intentBatchHash}</TableCell>
            <TableCell>
              <Address truncate address={intentBatch.root as `0x${string}`} />
            </TableCell>
            <TableCell>
              <TimeFromDate
                length={1}
                type="DATETIME"
                date={intentBatch?.createdAt}
              />
            </TableCell>
            <TableCell>{intentBatch.intents.length}</TableCell>
            <TableCell>
              {intentBatch.executedAt ? (
                <TimeFromDate
                  length={1}
                  type="DATETIME"
                  date={intentBatch.executedAt}
                />
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>
              {intentBatch.cancelledAt ? (
                <TimeFromDate
                  length={1}
                  type="DATETIME"
                  date={intentBatch.cancelledAt}
                />
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>
              <IntentBatchDetails data={intentBatch} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

type IntentBatchDetails = {
  data: DBIntentBatchActiveItem
}

const IntentBatchDetails = ({ data }: IntentBatchDetails) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"sm"} variant="outline">
          Details
        </Button>
      </SheetTrigger>
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
                <Row
                  classNameValue="font-bold"
                  label="Created"
                  value={data.createdAt?.toDateString()}
                />
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
                    <TimestampBeforeIntent
                      key={intent.id}
                      epoch={String(intent?.intentArgs[0].value)}
                    />
                  )
                }
                if (
                  intent.intentId ===
                  "0x442b009e32aff0b209576058382fa39b6fe50c61d51aa1361cf1bad9398cd893"
                ) {
                  return (
                    <TokenReleaseIntent
                      key={intent.id}
                      token={String(intent?.intentArgs[0].value)}
                      amount={String(intent?.intentArgs[1].value)}
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
