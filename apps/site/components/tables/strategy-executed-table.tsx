"use client";

import { useGetSafeAddress } from "@district-labs/intentify-core-react";
import { type DbIntentBatchWithRelations } from "@district-labs/intentify-database";

import { DataTable } from "@/components/data-table/data-table";
import { useIntentBatchUserFind } from "@/hooks/intent-batch/user/use-intent-batch-user-find";

import { columnsStrategyExecuted } from "./columns-strategy-executed-table";

interface StrategyExecutedTable {
	strategyId: string;
	pageCount: number;
	filterData?: (data: any) => any;
	transformData?: (data: any) => any;
}

export function StrategyExecutedTable({
	strategyId,
	pageCount,
}: StrategyExecutedTable) {
	const address = useGetSafeAddress();
	const { data, isSuccess } = useIntentBatchUserFind({
		filters: {
			root: address,
			strategyId: strategyId,
		},
	});

	return (
		<DataTable
			columns={columnsStrategyExecuted}
			data={
				!isSuccess
					? []
					: data.flatMap((item: DbIntentBatchWithRelations) => item.executedTxs)
			}
			pageCount={pageCount}
		/>
	);
}
