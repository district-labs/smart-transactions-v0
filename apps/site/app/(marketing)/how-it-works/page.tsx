import Image from "next/image"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import PotentialChart from "@/components/charts/potential-chart"
import { Icons } from "@/components/icons"
import { IntentsAccordion } from "@/components/intents-accordion"

const simpleSectionFeatures = [
  { name: "Explore 10+ strategies", icon: Icons.search },
  { name: "Get started with just $1", icon: Icons.search },
  { name: "Use AI to generate strategies", icon: Icons.search },
  { name: "Weight the pros and cons at a glance", icon: Icons.search },
]

const faqs = [
  {
    question: "How does District work?",
    answer:
      "District is fully noncustodial. Your keys, your crypto, your money.",
  },
  {
    question: "Is my money safe at District?",
    answer: "Yes, duh",
  },
  {
    question: "How much does it cost?",
    answer:
      "Openning an account with District is free and permissionless. Our platform fee is just 0.25% annually, and each strategy has a variable fee between 0% and 10% of profits.",
  },
]

export default function Home() {
  return (
    <div className="space-y-4 overflow-hidden">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 bg-background px-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:px-8 lg:py-28"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Investment strategies, <br /> simplified
        </h1>
        <Balancer className="max-w-3xl text-lg text-muted-foreground sm:text-xl">
          District helps you transform your ideas into action with a no-code
          strategy builder.
        </Balancer>
        <Link href="/signup" className={cn(buttonVariants())}>
          Get started
          <span className="sr-only">Get Started</span>
        </Link>
      </section>
      <section
        id="intent"
        aria-labelledby="intent-heading"
        className="mx-auto max-w-screen-2xl px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="space-y-6 lg:max-w-xl">
              <h2 className="text-3xl tracking-tight sm:text-4xl">
                State your intents. <br />
                We&apos;ll do the rest.
              </h2>
              <Balancer className="text-lg leading-7 text-muted-foreground">
                Use our AI or no-code strategy builder to set your intentions
                and we&apos;ll handle the trades, staking, and rebalancing of
                your portfolio for you. we make it easy and safe to customize
                your investing strategies by helping you see the returns and
                risks you&apos;re taking.
              </Balancer>
              <IntentsAccordion timeout={8000} />
            </div>
          </div>
          <div className="order-first flex w-[48rem] max-w-none items-center justify-start rounded-xl bg-secondary p-8 shadow-xl ring-1 ring-primary sm:w-[57rem] md:-ml-4 md:px-16 lg:order-last lg:-ml-0 lg:h-[480px]">
            <Image
              src="/images/build.png"
              alt="Strategy components"
              width={400}
              height={400}
              className="p-8 lg:mr-4"
            />
          </div>
        </div>
      </section>
      <section
        id="simple"
        aria-labelledby="simple-heading"
        className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="space-y-6 lg:max-w-xl">
              <h2 className="text-3xl tracking-tight sm:text-4xl">
                Simple, automated, <br />
                crypto investing
              </h2>
              <Balancer className="text-lg leading-7 text-muted-foreground">
                Invest like the best, with automated, expert-built strategies.
                Pick a strategy, test its performance, then execute trades - all
                in one platform.
              </Balancer>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                {simpleSectionFeatures.map((feature) => (
                  <dt
                    key={feature.name}
                    className="flex items-center text-base font-semibold leading-7"
                  >
                    <feature.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                    {feature.name}
                  </dt>
                ))}
              </dl>
            </div>
          </div>
          <div className="order-first flex items-start justify-end">
            <Image
              src="/images/smarter.png"
              alt="App screenshot"
              width={1028}
              height={686}
              className="-ml-16 max-h-96 w-[48rem] max-w-none rounded-xl object-cover shadow-xl ring-1 ring-border sm:w-[57rem]"
            />
          </div>
        </div>
      </section>
      <section
        id="potential"
        aria-labelledby="potential-heading"
        className="container py-8 lg:py-12"
      >
        <div className="relative isolate space-y-12 overflow-hidden rounded-sm border bg-secondary/20 px-6 py-20 sm:rounded-3xl sm:px-10">
          <div className="mx-auto max-w-2xl sm:text-center">
            <span className="text-base font-semibold leading-7 text-primary">
              Put your money to work
            </span>
            <h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">
              Check out your potential
            </h2>
            <Balancer className="mt-4 text-lg leading-8 text-muted-foreground">
              See how much your money could grow when you put it towards a
              strategy.
            </Balancer>
          </div>
          <PotentialChart />
        </div>
      </section>
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="container px-6 py-12 lg:px-8"
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold leading-10 tracking-tight">
              Still have questions?
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Reach out to our{" "}
              <a
                href="#"
                className="font-semibold text-primary hover:text-primary/80"
              >
                customer support
              </a>{" "}
              team.
            </p>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base font-semibold leading-7">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
