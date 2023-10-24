/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import tokenListGoerli from "@/data/token-list-district-goerli.json"
import { useImmer } from "use-immer"

import type { TokenList } from "@/types/token-list"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import TokenSelect from "@/components/fields/token-select"

const tokenListDistrictGoerli: TokenList = tokenListGoerli

export const strategyLeverageLong = {
  aaveLeverageLong: {
    supplyToken: tokenListDistrictGoerli.tokens[0],
    borrowToken: tokenListDistrictGoerli.tokens[1],
    interestRateMode: "0",
    minHealthFactor: "1.2",
  },
}

export const useStrategyLeverageLong = () => {
  const [intentBatch, setIntentBatch] = useImmer(strategyLeverageLong)
  return [intentBatch, setIntentBatch] as const
}

export const strategyLeverageLongForm = {
  aaveLeverageLong: {
    SupplyToken: (intentBatch: any, setIntentBatch: any) => (
      <div className="">
        <Label htmlFor="supply" className="text-muted-foreground">
          Supply
        </Label>
        <TokenSelect
          tokenList={tokenListDistrictGoerli}
          selectedToken={intentBatch["aaveLeverageLong"]["supplyToken"]}
          setSelectedToken={(newToken) =>
            setIntentBatch((draft: any) => {
              draft["aaveLeverageLong"]["supplyToken"] = newToken
            })
          }
        />
      </div>
    ),
    BorrowToken: (intentBatch: any, setIntentBatch: any) => (
      <div className="">
        <Label htmlFor="borrow" className="text-muted-foreground">
          Borrow
        </Label>
        <TokenSelect
          tokenList={tokenListDistrictGoerli}
          selectedToken={intentBatch.aaveLeverageLong.borrowToken}
          setSelectedToken={(newToken) =>
            setIntentBatch((draft: any) => {
              draft.aaveLeverageLong.borrowToken = newToken
            })
          }
        />
      </div>
    ),
    InterestRateMode: (intentBatch: any, setIntentBatch: any) => (
      <div className="grid gap-2">
        <Label htmlFor="selling">Interest Rate Mode</Label>
        <Select
          onValueChange={(value) =>
            setIntentBatch((draft: any) => {
              draft.aaveLeverageLong.interestRateMode = value
            })
          }
          value={intentBatch.aaveLeverageLong.interestRateMode}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Select Interest Rate Mode</SelectItem>
            <SelectItem value="1">Variable</SelectItem>
            <SelectItem value="2">Stable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    MinHealthFactor: (intentBatch: any, setIntentBatch: any) => (
      <div className="grid gap-2">
        <Label htmlFor="selling">Minimum Health Factor</Label>
        <div className="flex">
          <Slider
            defaultValue={[
              Number(intentBatch.aaveLeverageLong.minHealthFactor),
            ]}
            min={1}
            max={3}
            step={0.01}
            onValueChange={(value) =>
              setIntentBatch((draft: any) => {
                draft.aaveLeverageLong.minHealthFactor = value
              })
            }
          />
          <span className="pl-3 text-xl font-medium">
            {intentBatch.aaveLeverageLong.minHealthFactor}
          </span>
        </div>
      </div>
    ),
  },
}
