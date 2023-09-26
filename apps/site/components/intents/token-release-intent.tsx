import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Row } from '../shared/row';

type TokenReleaseIntent = React.HTMLAttributes<HTMLElement> & {
  token?: string
  amount?: string
}

export const TokenReleaseIntent = ({ className, token, amount }: TokenReleaseIntent) => { 
    const classes = cn(className);
   
    return(
     <Card className={classes}>
       <CardHeader>
       <h3 className='font-bold text-2xl'>Token Release Intent</h3>
       </CardHeader>
       <CardContent>
       <div className='flex flex-col gap-y-4'>
         <Row label='Token' value={token} />
         <Row label='Amount' value={amount} />
       </div>
       </CardContent>
     </Card>
   )}