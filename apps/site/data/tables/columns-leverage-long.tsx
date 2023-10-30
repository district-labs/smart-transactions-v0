"use client"

import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"
import {
  ERC20Name,
  ERC20Symbol,
} from "@/integrations/erc20/components/erc20-read"
import { formatUnits } from "viem"

import { bigIntToDecimal } from "@/lib/utils/big-int-to-decimals"
import { Address } from "@/components/blockchain/address"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import TimeFromEpoch from "@/components/shared/time-from-epoch"

export const columnsLeverageLong = [
  {
    accessorKey: "chainId",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Chain" />
    ),
  },
  {
    accessorKey: "supplyAsset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Supply Asset" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20Symbol
          className="font-bold"
          address={row.original.supplyAsset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <span className="ml-2 text-xs">
          (
          <ERC20Name
            address={row.original.supplyAsset as `0x${string}`}
            chainId={row.original.chainId}
          />
          )
        </span>
        <Address
          isLink
          className="ml-2 text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.supplyAsset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "borrowAsset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Supply Asset" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20Symbol
          className="font-bold"
          address={row.original.borrowAsset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <span className="ml-2 text-xs">
          (
          <ERC20Name
            address={row.original.borrowAsset as `0x${string}`}
            chainId={row.original.chainId}
          />
          )
        </span>
        <Address
          isLink
          className="ml-2 text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.borrowAsset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "interestRateMode",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Interest Rate Mode" />
    ),
    cell: ({ row }: any) => (
      <>
        {row.original.interestRateMode == 1 && (
          <span className="text-xs">Variable</span>
        )}
        {row.original.interestRateMode == 2 && (
          <span className="text-xs">Stable</span>
        )}
      </>
    ),
  },
  {
    accessorKey: "minHealthFactor",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Min Health Factor" />
    ),
    cell: ({ row }: any) => (
      <>
        <span className="">
          {bigIntToDecimal(
            BigInt(formatUnits(row.original.minHealthFactor, 18)),
            2
          )}
        </span>
      </>
    ),
  },
  {
    accessorKey: "fee",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Execution Fee" />
    ),
    cell: ({ row }: any) => (
      <>
        <span className="">
          {bigIntToDecimal(BigInt(row.original.fee), 2)}%
        </span>
      </>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        {/* <div className="flex gap-x-2">
              {row.original.status === "open" && (
                <CancelIntentBundle
                  intentBatch={row.original.intentBatch}
                  signMessageComponent={
                    <Button variant={"destructive"} type="button" size="sm">
                      Cancel
                    </Button>
                  }
                  signTransactionComponent={
                    <Button variant={"default"} type="button" size="sm">
                      Execute
                    </Button>
                  }
                />
              )}
              <SheetIntentBatchDetails data={row.original.intentBatchDb} />
            </div> */}
      </div>
    ),
  },
]
