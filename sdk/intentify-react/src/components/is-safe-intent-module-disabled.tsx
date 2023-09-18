import { useIsSafeIntentModuleEnabled } from "@/hooks/use-is-safe-intent-module-enabled";
import { cn } from "@/utils";
import * as React from "react";

type IsSafeIntentModuleDisabled = React.HTMLAttributes<HTMLElement> & {
	watch?: boolean;
};

export const IsSafeIntentModuleDisabled = ({
	children,
	className,
	watch = true,
}: IsSafeIntentModuleDisabled) => {
	const isModuleEnabled = useIsSafeIntentModuleEnabled(watch);
	const classes = cn(className);

	if (!isModuleEnabled) {
		return <div className={classes}>{children}</div>;
	}
	return null;
};
