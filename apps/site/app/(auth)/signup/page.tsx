import Image from "next/image"
import Link from "next/link"
import { faker } from "@faker-js/faker"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { NewUserButton, Profile } from "@/components/auth/login-button"
import { Icons } from "@/components/icons"

const onboardingSteps = [
  {
    name: "Verify your identity",
    icon: Icons.user,
  },
  {
    name: "Fund your account",
    icon: Icons.bank,
  },
  {
    name: "Set up your first strategy",
    icon: Icons.rocket,
  },
]

// TODO: Handle case where we have an already linked account / wallet.
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative flex w-full flex-1 flex-col items-start justify-between bg-secondary/70 px-8 py-6">
        <Link href="/" className="z-20 flex items-center space-x-2">
          <Icons.logo className=" h-10 w-10 text-primary" />
          <span className="inline-block text-xl font-bold uppercase">
            {siteConfig.name}
          </span>
        </Link>
        <div className="space-y-6 lg:max-w-xl">
          <h2 className="text-3xl tracking-tight sm:text-4xl">
            Welcome to District
          </h2>
          <Balancer className="text-lg leading-7 text-muted-foreground">
            We designed District to help you transform your investing ideas into
            strategies. Your account includes a noncustodial digital wallet, a
            no-code strategy builder, and access to pre-built investment
            strategies & portfolios.
          </Balancer>
          <p className="pt-4 text-base font-bold md:pt-8 lg:pt-12">
            What to expect:
          </p>
          <dl className="max-w-xl space-y-8 text-base leading-7 lg:max-w-none">
            {onboardingSteps.map((step) => (
              <dt key={step.name} className="flex items-center">
                <step.icon className="mr-4 h-5 w-5" />
                {step.name}
              </dt>
            ))}
          </dl>
          <NewUserButton />
        </div>
        <footer className="relative z-20">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;District let&apos;s me invest like I have my own hedge
              fund.&rdquo;
            </p>
            <span className="text-sm">{faker.person.fullName()}</span>
          </blockquote>
        </footer>
      </div>
      <main className="hidden flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex lg:px-20 xl:px-24">
        <Image
          src="/images/auth-layout.webp"
          alt="District geodesic dome"
          width={577}
          height={571}
          className="mx-auto"
        />
      </main>
    </div>
  )
}
