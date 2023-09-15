import { useGetSafeAddress } from "..";
import { useIsSafeMaterialized } from "@/hooks/use-is-safe-materialized";
import { cn } from "@/utils";
import * as React from "react";

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
