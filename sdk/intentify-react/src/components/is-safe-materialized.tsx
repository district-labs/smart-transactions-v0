import { useIsSafeMaterialized } from "@/hooks/use-is-safe-materialized";
import { cn } from "@/utils";
import * as React from "react";

type IsSafeMaterialized = React.HTMLAttributes<HTMLElement> & {
  watch?: boolean;
};

export const IsSafeMaterialized = ({
  children,
  className,
  watch = true,
}: IsSafeMaterialized) => {
  const isSafeMaterialized = useIsSafeMaterialized(watch);
  const classes = cn(className);

  if (!isSafeMaterialized) return null;
  return <div className={classes}>{children}</div>;
};
