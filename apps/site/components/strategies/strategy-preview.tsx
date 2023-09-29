import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '../ui/button';
import { BackgroundImage } from '../shared/background-image';
  

type StrategyPreview = React.HTMLAttributes<HTMLElement> & {
    name: string
    description: string
    image: string
    nonceType?: string
    modules?: string[]
    intentView?: React.ReactElement
}

export const StrategyPreview = ({ className, name, description, image = '/images/story/limit-order.png', nonceType, modules, intentView }: StrategyPreview) => { 
    const classes = cn(className, 'flex flex-col overflow-hidden');
   
    return(
     <Card className={classes}>
       <CardHeader className="bg-emerald-800 text-white relative lg:py-16 overflow-hidden">
        <BackgroundImage image={image} />
         <div className='z-10'>
            <h3 className='font-bold text-3xl'>{name}</h3>
            <p>{description}</p>
         </div>
       </CardHeader>
       <CardContent className="flex-1">
       
       </CardContent>
       <CardFooter className="pb-5 flex gap-x-4">
           <Sheet>
                <SheetTrigger>
                    <Button size={'sm'} className='text-sm'>Create Transaction</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>{name}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                    </SheetHeader>
                    <hr className="my-4" />
                    {intentView}
                </SheetContent>
            </Sheet>
           <Sheet>
                <SheetTrigger>
                    <Button size={'sm'} variant={'outline'} className='text-sm'>Details</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>{name}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                    </SheetHeader>
                    <hr className="my-4" />
                    <span className='text-sm'><span className='font-bold'>Nonce Type:</span> {nonceType}</span>
                    {
                        modules && modules.length > 0 &&
                        <div>
                        <h5 className='font-bold text-sm'>Intent Modules</h5>
                        <ul className='list-disc list-inside pl-3'>
                            {
                            modules.map((module, index) => (
                                <li key={index}>{module}</li>
                            ))
                            }
                        </ul>
                        </div>
                    }
                </SheetContent>
            </Sheet>
       </CardFooter>
     </Card>
   )}