import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@district-labs/ui-react"

export type NonceManager = {
  nonce: {
    type: "standard" | "dimensional" | "time" | "module"
    args: any[]
  }
}

export const nonceManager = {
  nonce: {
    type: "standard",
    args: [0, 0, 0],
  },
} as NonceManager

export const nonceManagerFields = {
  NonceType: (intentBatch: any, setIntentBatch: any) => (
    <div className="grid gap-2">
      <Label htmlFor="selling">Nonce</Label>
      <Select
        onValueChange={(value: any) =>
          setIntentBatch((draft: any) => {
            draft.nonce.type = value
          })
        }
        value={intentBatch?.nonce?.type}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="dimensional">Dimensional</SelectItem>
          <SelectItem value="time">Time</SelectItem>
          <SelectItem value="module">Module</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  NonceDimensional: (
    intentBatch: any,
    setIntentBatch: any,
    config?: {
      label: string
      labelTrigger: string
      classNameLabel?: string
      classNameTrigger?: string
    }
  ) => (
    <div className="">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <p className={config?.classNameTrigger}>
            {config?.labelTrigger || "Advanced Settings"}
          </p>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Label htmlFor="supply" className={config?.classNameLabel}>
            {config?.label || "Queue"}
          </Label>
          <Input
            type="number"
            value={intentBatch?.nonce?.args[0]}
            onChange={(event: any) =>
              setIntentBatch((draft: any) => {
                draft["nonce"]["args"][0] = (
                  event.target as HTMLInputElement
                ).value
              })
            }
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
  NonceTime: (
    intentBatch: any,
    setIntentBatch: any,
    config?: {
      label: string
      labelTrigger: string
      classNameLabel?: string
      classNameTrigger?: string
    }
  ) => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <p className={config?.classNameTrigger}>
          {config?.labelTrigger || "Advanced Settings"}
        </p>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex justify-between gap-x-4">
          <div className="">
            <Label htmlFor="supply" className="text-muted-foreground">
              ID
            </Label>
            <Input
              type="number"
              value={intentBatch?.nonce?.args[0] || 0}
              onChange={(event: any) =>
                setIntentBatch((draft: any) => {
                  draft["nonce"]["args"][0] = (
                    event.target as HTMLInputElement
                  ).value
                })
              }
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="supply" className="text-muted-foreground">
              Seconds Elapsed
            </Label>
            <Input
              type="number"
              value={intentBatch?.nonce?.args[1] || 0}
              onChange={(event: any) =>
                setIntentBatch((draft: any) => {
                  draft["nonce"]["args"][1] = (
                    event.target as HTMLInputElement
                  ).value
                })
              }
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="supply" className="text-muted-foreground">
              Total Transactions
            </Label>
            <Input
              type="number"
              value={intentBatch?.nonce?.args[2] || 0}
              onChange={(event: any) =>
                setIntentBatch((draft: any) => {
                  draft["nonce"]["args"][2] = (
                    event.target as HTMLInputElement
                  ).value
                })
              }
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
