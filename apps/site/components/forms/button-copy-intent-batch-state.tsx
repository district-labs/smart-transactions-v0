import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toObjectString } from "@/data/columns/to-object-string"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toHex } from "viem"

import { toast } from "@district-labs/ui-react"

type ButtonCopyIntentBatchState = React.HTMLAttributes<HTMLElement> & {
  intentBatchData: any
}

export const ButtonCopyIntentBatchState = ({
  children,
  intentBatchData,
}: ButtonCopyIntentBatchState) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [url, setUrl] = React.useState<string>("")
  React.useEffect(() => {
    if (intentBatchData) {
      const current = new URLSearchParams(Array.from(searchParams.entries())) // -> has to use this form
      current.set("intentBatchData", toHex(toObjectString(intentBatchData)))
      const search = current.toString()
      const url = `${pathname}?${search}`
      setUrl(window.location.origin + url)
    }
  }, [intentBatchData, pathname, router, searchParams])

  return (
    <CopyToClipboard
      text={url}
      onCopy={() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        toast({
          description: "Copied Smart Transaction to Clipboard.",
        })
      }
    >
      <span className="">{children}</span>
    </CopyToClipboard>
  )
}
