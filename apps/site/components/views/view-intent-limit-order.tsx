import * as React from 'react';
import { cn } from '@/lib/utils';
import FormIntentLimitOrder from '../forms/form-intent-limit-order';
import { UserLimitOrdersTable } from '../user/user-limit-order-table';
import { useGetIntentBatchFind } from '@/hooks/intent-batch/use-get-intent-batch-all';
import { transformLimitOrderIntentQueryToLimitOrderData } from '@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data';

type ViewIntentLimitOrder = React.HTMLAttributes<HTMLElement>;

export const ViewIntentLimitOrder = ({ children, className }: ViewIntentLimitOrder) => { 
 const classes = cn(className);
 const {data: intentBatchQuery, isSuccess } = useGetIntentBatchFind()
 return(
  <div className={classes}>
      <FormIntentLimitOrder />
      {
              isSuccess && intentBatchQuery && Array.isArray(intentBatchQuery) &&
              <UserLimitOrdersTable pageCount={1} data={intentBatchQuery?.map(transformLimitOrderIntentQueryToLimitOrderData)} />
            }
  </div>
)}