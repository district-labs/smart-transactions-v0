"use client"

import FormErc20LimitOrder from "@/components/forms/form-erc20-limit-order"

export default function Home() {
  return (
    <div className="space-y-4 overflow-hidden">
      <div className="container max-w-2xl">
        <h3 className='font-extrabold text-4xl'>Limit Order</h3>
        <p className='text-sm mt-2'>
          Cras rutrum magna id pulvinar placerat. Etiam nulla neque, dictum in ipsum eget, interdum pharetra risus. Curabitur egestas magna in nisi efficitur mollis. Duis magna libero, fermentum vel dapibus non, euismod sed nunc. In in magna lacus.
        </p>
        <div className='py-2'>
          
        </div>
        <FormErc20LimitOrder />
      </div>
    </div>
  )
}
