import {
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

interface NonceManagerFieldConfig {
  label: string
}

export const nonceManager = {
  nonce: {
    type: "standard",
    args: [],
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
        value={intentBatch.nonce.type}
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
  NonceDimensional: (setIntentBatch: any) => (
        <div className=''>
          <Label htmlFor="supply" className="text-muted-foreground">
            Queue
          </Label>
          <Input
            type="number"
            onChange={(event:any) =>
              setIntentBatch((draft: any) => {
                draft["nonce"]["args"][0] = (
                  event.target as HTMLInputElement
                ).value
              })
            }
          />
        </div>
  ),
  NonceTime: (setIntentBatch: any) => (
      <div className="flex justify-between gap-x-4">
        <div className='flex-1'>
          <Label htmlFor="supply" className="text-muted-foreground">
            ID
          </Label>
          <Input
            type="number"
            onChange={(event:any) =>
              setIntentBatch((draft: any) => {
                draft["nonce"]["args"][0] = (
                  event.target as HTMLInputElement
                ).value
              })
            }
          />
        </div>
        <div className='flex-1'>
          <Label htmlFor="supply" className="text-muted-foreground">
            Delta
          </Label>
          <Input
            type="number"
            onChange={(event:any) =>
              setIntentBatch((draft: any) => {
                draft["nonce"]["args"][1] = (
                  event.target as HTMLInputElement
                ).value
              })
            }
          />
        </div>
        <div className='flex-1'>
          <Label htmlFor="supply" className="text-muted-foreground">
            Count
          </Label>
          <Input
            type="number"
            onChange={(event:any) =>
              setIntentBatch((draft: any) => {
                draft["nonce"]["args"][2] = (
                  event.target as HTMLInputElement
                ).value
              })
            }
          />
        </div>
      </div>
  ),
}
