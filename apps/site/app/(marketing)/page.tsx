'use client'
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import FormIntentLimitOrder from "@/components/forms/form-intent-limit-order"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useGetIntentBatchFind } from "@/hooks/intent-batch/use-get-intent-batch-all"
import { UserLimitOrdersTable } from "@/components/user/user-limit-order-table"
import { transformLimitOrderIntentQueryToLimitOrderData } from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
import { LinkComponent } from "@/components/shared/link-component"


export default function Home() {

  const {data: intentBatchQuery, isSuccess } = useGetIntentBatchFind()
  return (
    <div className="space-y-4 overflow-hidden">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 bg-background px-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:px-8 lg:py-20"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Web3 Transactions Simplified
        </h1>
        <Balancer className="max-w-3xl text-lg text-muted-foreground sm:text-xl">
          Interact with blockchains without the hassle. Set it and forget it transactions.
        </Balancer>
      </section>
      <section>
        <div className="mx-auto max-w-screen-lg">
          <div className='text-center mb-3'>
            <h3 className='font-normal text-lg'>Try it out with a <span className='font-bold'>Uniswap V3 Limit Order intent</span> on Goerli Testnet</h3>
          </div>
          <FormIntentLimitOrder />
          <div className='text-center mt-3'>
            <p className='font-normal text-normal mb-4'><span className='italic'>You are not signing a normal transaction.</span> 
            <br/>The signed message is comprised of intent modules like TimestampBefore and TokenSwap.</p>
            <LinkComponent href='/how-it-works'>
              <Button size={'lg'} className='text-sm'>How It Works</Button>
            </LinkComponent>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className='text-center'>
          <h3 className='font-bold text-4xl mb-3'>Uniswap V3 Limit Orders</h3>
          <p className=''>
            You have {isSuccess && intentBatchQuery ? intentBatchQuery.length : 0} limit orders.
          </p>
        </div>
        <Card className="mx-auto max-w-screen-2xl mt-10">
          <CardContent>
          {
            isSuccess && intentBatchQuery && Array.isArray(intentBatchQuery) &&
            <UserLimitOrdersTable pageCount={1} data={intentBatchQuery?.map(transformLimitOrderIntentQueryToLimitOrderData)} />
          }
          </CardContent>
        </Card>
      </section>
      <section className="py-10 lg:py-20 px-10 lg:px-20">
        <div className='mb-32'>
          <h5 className='font-normal text-xl text-center'>Strategies</h5>
          <h3 className='font-extrabold text-5xl text-center my-3'>Explore What&apos;s Coming Next</h3>
          <p className='text-center'>
            Strategies are powered by the <span className='font-bold'>District Intent Protocol</span>, a permissionless, 
            <br/> non-custodial, and composable smart contract framework.
          </p>
        </div>
        <div className="mx-auto max-w-screen-3xl grid grid-cols-3 gap-x-10">
          <StrategyPreview
            name="Limit Order"
            description="Set a limit order to buy or sell tokens at a specific price."
            image="/images/limit-order.png"
            nonceType="QueueNonce"
            modules={['TimestampBefore', 'TokenRelease', 'TokenSwap']}
          />

          <StrategyPreview
            name="ERC20 Rebalance"
            description="Rebalance your portfolio to a target allocation."
            image="/images/dca.png"
            nonceType="TimeNonce"
            modules={['TokenRelease', 'TokenSwap']}
          />

          <StrategyPreview
            name="PoolTogether Weekly Deposit"
            description="Deposit into PoolTogether V4 PrizePool weekly."
            image="/images/leverage.png"
            nonceType="TimeNonce"
            modules={['AveragePrizeZK']}
          />
        </div>
      </section>
    </div>
  )
}



type StrategyPreview = React.HTMLAttributes<HTMLElement> & {
  name: string
  description: string
  image: string
  nonceType?: string
  modules?: string[]
}

const StrategyPreview = ({ className, name, description, image, nonceType, modules }: StrategyPreview) => { 
 const classes = cn(className, 'flex flex-col');

 return(
  <Card className={classes}>
    <CardHeader>
      {/* <img src={image} alt={name} /> */}
      <h3 className='font-bold text-xl'>{name}</h3>
      <p>{description}</p>
      <span className='text-sm'><span className='font-bold'>Nonce Type:</span> {nonceType}</span>
    </CardHeader>
    <CardContent className="flex-1">
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
    </CardContent>
    <CardFooter className="bg-neutral-100 pt-3 pb-3">
      <LinkComponent href='/how-it-works'>
        <Button size={'sm'} className='text-sm'>Learn more</Button>
      </LinkComponent>
    </CardFooter>
  </Card>
)}