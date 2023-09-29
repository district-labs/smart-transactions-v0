import * as React from 'react';
import { cn } from '@/lib/utils';

type BackgroundImage = React.HTMLAttributes<HTMLElement> & {
    image?: string;
}

export const BackgroundImage = ({ children, className, image }: BackgroundImage) => {
 const classes = cn(className, 'absolute inset-0 z-0 opacity-10');

 return(
  <div className={classes}>
    <img src={image} alt='background' className='object-cover object-center h-full w-full' />
  </div>
)}