import * as React from "react";
import { useIsSafeMaterialized } from "../hooks/use-is-safe-materialized";
import { cn } from "../utils";

type IsSafeCounterfactual = React.HTMLAttributes<HTMLElement> & {
  watch?: boolean;
};

export const IsSafeCounterfactual = ({
  children,
  className,
  watch = true,
}: IsSafeCounterfactual) => {
  const isSafeMaterialized = useIsSafeMaterialized(watch);
  const classes = cn(className);

  if (!isSafeMaterialized) {
    return <div className={classes}>{children}</div>;
  }
  return null;
};
