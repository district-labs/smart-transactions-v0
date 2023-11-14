import * as React from "react"
import { networkData } from "@/data/network-data"
import {
  Button,
  Card,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { NetworkDetailsAndConnect } from "./network-details-and-connect"

type NetworkConnectionManage = React.HTMLAttributes<HTMLElement> & {
  chainsSupported?: number[]
  label?: string
}

export const NetworkConnectionManage = ({
  children,
  label = "Connect to Supported Network",
  chainsSupported,
}: NetworkConnectionManage) => {
  const [networkList, setNetWorkList] = React.useState<any>([])
  React.useEffect(() => {
    if (chainsSupported) {
      setNetWorkList(
        Object.values(networkData).filter((network: any) =>
          chainsSupported.includes(network.chainId)
        )
      )
    } else {
      setNetWorkList(Object.values(networkData))
    }
  }, [chainsSupported])

  return (
    <Sheet>
      <SheetTrigger>
        <Button size="sm">{children || label}</Button>
      </SheetTrigger>
      <SheetContent className="w-full lg:w-1/2">
        <SheetHeader>
          <SheetTitle>Network Connection Manager</SheetTitle>
          <SheetDescription>Connect to a supported network.</SheetDescription>
        </SheetHeader>
        <hr className="my-4" />
        <div className="grid gap-y-5">
          {networkList &&
            networkList?.map((network: any) => (
              <NetworkDetailsAndConnect key={network.name} {...network} />
            ))}{" "}
          {!networkList?.length && (
            <Card className="flex min-h-[280px] flex-col items-center justify-center gap-y-2 bg-neutral-100 p-5">
              <p className="text-center">Strategy Not Currently Available</p>
              <p className="text-xs font-bold">Check back soon</p>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
