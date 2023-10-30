import * as React from "react";
import { useGetSafeAddress } from "..";
import { cn } from "../utils";

type SafeDeterministicAddress = React.HTMLAttributes<HTMLElement>;

export const SafeDeterministicAddress = ({
  className,
}: SafeDeterministicAddress) => {
  const safeAddress = useGetSafeAddress();
  const classes = cn(className);

  if (!safeAddress) {
    return null;
  }
  return <span className={classes}>{safeAddress}</span>;
};
