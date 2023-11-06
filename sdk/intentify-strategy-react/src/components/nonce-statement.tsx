import * as React from "react"

type NonceStatement = React.HTMLAttributes<HTMLElement> & {
  nonce?: {
    type: string
    args: any[]
  }
}

export const NonceStatement = ({
  children,
  className,
  nonce,
}: NonceStatement) => {
  if (nonce?.type === "standard") {
    return (
      <p className={className}>
        Executable when standard nonce accumulator is reached.
      </p>
    )
  }
  if (nonce?.type === "dimensional") {
    return (
      <p className={className}>
        Executable when{" "}
        <span className="font-bold"> queue {nonce?.args[0]}</span> accumulator
        is reached.
      </p>
    )
  }
  if (nonce?.type === "time") {
    return (
      <p className={className}>
        Executable every{" "}
        <span className="font-bold">{`${nonce?.args[1]}`} seconds</span> with a{" "}
        <span className="font-bold">{`${nonce?.args[2]}`} transaction</span>{" "}
        limit.
      </p>
    )
  }
  if (nonce?.type === "module") {
    return (
      <p className={className}>
        Executable according to intent module rules and conditions.
      </p>
    )
  }
}
