import { forwardRef, useMemo, type InputHTMLAttributes } from "react"
import Image from "next/image"
import { isAddress, type Address } from "viem"
import { useEnsAddress, useEnsAvatar } from "wagmi"

import { cn } from "@/lib/utils"

import { Input } from "../ui/input"
import { BlockExplorerLink } from "./block-explorer-link"

interface InputAccountProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string
}

const InputAccount = forwardRef<HTMLInputElement, InputAccountProps>(
  ({ value, ...props }, ref) => {
    const isValidAddress = useMemo(
      () => typeof value === "string" && isAddress(value),
      [value]
    )
    const isEnsName = useMemo(
      () => typeof value === "string" && value.endsWith(".eth"),
      [value]
    )

    const { data: ensAddress } = useEnsAddress({
      name: value,
      // Resolve ENS only on mainnet
      chainId: 1,
      enabled: isEnsName,
    })

    const isExistingEnsName = useMemo(
      () => isEnsName && ensAddress,
      [isEnsName, ensAddress]
    )

    const { data: ensAvatar } = useEnsAvatar({
      name: value,
      // Resolve ENS only on mainnet
      chainId: 1,
      enabled: Boolean(isEnsName && isExistingEnsName),
    })

    return (
      <div
        className={cn(
          "relative flex items-center justify-between rounded-full border border-stone-300",
          isValidAddress && "border-r-0"
        )}
      >
        <Input
          ref={ref}
          className={cn(
            "h-12 border-none pl-4 pr-12 text-sm focus:ring-0 focus:ring-offset-0 dark:focus:ring-0 dark:focus:ring-offset-0",
            isValidAddress && "pr-2"
          )}
          {...props}
        />
        {(isValidAddress || isExistingEnsName) && value && (
          <div className="w-fit rounded-full border-2 border-stone-300 p-0.5">
            <BlockExplorerLink
              address={
                isExistingEnsName && ensAddress
                  ? ensAddress
                  : (value.toString() as Address)
              }
            >
              <div className="relative h-10 w-10 rounded-full">
                <Image
                  fill
                  priority
                  alt={"avatar"}
                  className="rounded-full object-cover"
                  loader={({ src }) => `${src}?w=${40}&q=${100}`}
                  quality={100}
                  sizes="40px"
                  src={
                    ensAvatar ??
                    `https://cdn.stamp.fyi/avatar/${
                      ensAddress ?? value.toString()
                    }?w=46&h=46`
                  }
                />
              </div>
            </BlockExplorerLink>
          </div>
        )}
      </div>
    )
  }
)

InputAccount.displayName = "InputAccount"
export { InputAccount }
