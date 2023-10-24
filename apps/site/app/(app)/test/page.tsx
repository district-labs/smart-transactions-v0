"use client"

import FormErc20LimitOrder from "@/components/forms/form-erc20-limit-order"

export default function Home() {
  return (
    <div className="space-y-4 overflow-hidden">
      <div className="container max-w-2xl">
        <h3 className="text-4xl font-extrabold">Limit Order</h3>
        <p className="mt-2 text-sm">
          Cras rutrum magna id pulvinar placerat. Etiam nulla neque, dictum in
          ipsum eget, interdum pharetra risus. Curabitur egestas magna in nisi
          efficitur mollis. Duis magna libero, fermentum vel dapibus non,
          euismod sed nunc. In in magna lacus.
        </p>
        <div className="py-2"></div>
        <FormErc20LimitOrder />
      </div>
      <section className="bg-neutral-100 p-10"></section>
    </div>
  )
}
