import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '../ui/card';
import TimeFromEpoch from '../shared/time-from-epoch';

type TimestampIntent = React.HTMLAttributes<HTMLElement> & {
    epoch: string
}

export const TimestampBeforeIntent = ({ className, epoch }: TimestampIntent) => { 
 const classes = cn(className);

 return(
  <Card className={classes}>
    <CardHeader>
    <h3 className='font-bold text-2xl'>Timestamp Before Intent</h3>
    </CardHeader>
    <CardContent>
        <TimeFromEpoch type="DATETIME" length={4} date={epoch}/>
    </CardContent>
  </Card>
)}