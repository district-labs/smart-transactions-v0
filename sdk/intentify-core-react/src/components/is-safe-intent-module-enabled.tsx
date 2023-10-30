import * as React from "react";
import { useIsSafeIntentModuleEnabled } from "../hooks/use-is-safe-intent-module-enabled";
import { cn } from "../utils";

type IsSafeIntentModuleEnabled = React.HTMLAttributes<HTMLElement> & {
  watch?: boolean;
};

export const IsSafeIntentModuleEnabled = ({
  children,
  className,
  watch = true,
}: IsSafeIntentModuleEnabled) => {
  const isModuleEnabled = useIsSafeIntentModuleEnabled(watch);
  const classes = cn(className);

  if (!isModuleEnabled) return null;
  return <div className={classes}>{children}</div>;
};
