/* eslint-disable @next/next/no-img-element */
"use client"

import { strategies } from "@/data/strategies"
import { Button } from "@district-labs/ui-react"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { LinkComponent } from "@/components/shared/link-component"
import { CardStrategyPreview } from "@/components/strategies/card-strategy-preview"

export default function Home() {
  return (
    <div className="relative overflow-hidden pb-20">
      <SectionHero />
      <SectionAvailableStrategies />
      <SectionHowItWorks />
    </div>
  )
}

const SectionHero = () => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="px-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:px-8 lg:py-20"
    >
      <div className="mx-auto grid max-w-screen-2xl gap-x-10 lg:grid-cols-12">
        <div className="col-span-5 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight tracking-normal md:text-5xl lg:text-8xl lg:leading-[1.1]">
            <Balancer>Build Onchain Wealth</Balancer>
          </h1>
          <Balancer className="my-2 max-w-3xl text-lg text-muted-foreground sm:text-xl">
            Create a portfolio of automated trading strategies without writing a
            line of code.
          </Balancer>
          <div className="">
            <LinkComponent href={siteConfig.links.app}>
              <Button className="mt-4">Application</Button>
            </LinkComponent>
          </div>
        </div>
        <div className="col-span-7 hidden lg:block">
          <img
            alt="Preview of District Finance Account"
            src={"/images/preview-account.png"}
            className="rounded-2xl border-white shadow-xl"
          />
        </div>
      </div>
    </section>
  )
}
const SectionAvailableStrategies = () => {
  return (
    <section className="px-8">
      <div className="mx-auto mt-10 grid max-w-screen-2xl gap-10 text-left lg:grid-cols-3">
        {Object.values(strategies).map((strategy) => {
          const { name, description, id, alias } = strategy
          return (
            <CardStrategyPreview
              key={id}
              id={id}
              alias={alias}
              name={name}
              description={description}
            />
          )
        })}
      </div>
      <div className="container mt-10 text-center">
        <LinkComponent href={siteConfig.links.app}>
          <Button className="mt-4">Visit Application</Button>
        </LinkComponent>
      </div>
    </section>
  )
}

const SectionHowItWorks = () => {
  return (
    <section>
      <div className="container mt-20">
        <div className="grid gap-x-10 gap-y-32 lg:grid-cols-12">
          <div className="order-2 col-span-6 lg:order-1">
            <img
              alt="Preview of Intent Batch"
              src={"/images/preview-intent-batch.png"}
              className="rounded-2xl border-white shadow-xl"
            />
          </div>
          <div className="order-1 col-span-6 flex flex-col justify-center lg:order-2">
            <h1 className="text-5xl font-bold leading-tight tracking-normal md:text-5xl lg:text-8xl lg:leading-[1.1]">
              <Balancer>Smart Transactions</Balancer>
            </h1>
            <Balancer className="my-2 max-w-3xl text-lg text-muted-foreground sm:text-xl">
              District Finance lets users express transactions as a series of
              steps. Each step can be a trade, a transfer, or a call to a smart
              contract.
            </Balancer>
            <div className="">
              <Button className="mt-4">How It Works</Button>
            </div>
          </div>
        </div>
        <div className="mt-48 grid gap-x-10 gap-y-32 lg:grid-cols-12">
          <div className="order-2 col-span-6">
            <img
              alt="Preview of Intent Module"
              src={"/images/preview-code.png"}
              className="rounded-2xl border-white shadow-xl"
            />
          </div>
          <div className="order-1 col-span-6 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight tracking-normal md:text-5xl lg:text-8xl lg:leading-[1.1]">
              <Balancer>Modular Rules & Conditions</Balancer>
            </h1>

            <Balancer className="my-2 max-w-3xl text-lg text-muted-foreground sm:text-xl">
              At each step, users can specify rules and conditions that must be
              met before the step can be executed. This allows users to create
              complex strategies that are flexible and customizable.
            </Balancer>
            <div className="">
              <Button className="mt-4">The Research</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
