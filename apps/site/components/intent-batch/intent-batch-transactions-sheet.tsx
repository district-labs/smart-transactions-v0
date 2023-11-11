import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@district-labs/ui-react"
import { Blocks } from "lucide-react"

import { cn } from "@/lib/utils"

import { IntentBatchTransactionsTable } from "../tables/intent-batch-transactions-table"

type IntentBatchTransactionsSheet = React.HTMLAttributes<HTMLElement> & {
  transactions: any[]
}

export const IntentBatchTransactionsSheet = ({
  className,
  transactions,
}: IntentBatchTransactionsSheet) => {
  const classes = cn(className, "flex items-center gap-x-1")

  return (
    <Sheet>
      <SheetTrigger className={classes}>
        <Blocks size={12} />
        Transactions ({transactions?.length})
      </SheetTrigger>
      <SheetContent side={"right"} className="h-full w-full lg:w-2/3">
        <SheetHeader>
          <SheetTitle>Transactions</SheetTitle>
          <SheetDescription>
            All transactions executed for the smart transaction batch.
          </SheetDescription>
        </SheetHeader>
        <IntentBatchTransactionsTable pageCount={10} data={transactions} />
      </SheetContent>
    </Sheet>
  )
}
