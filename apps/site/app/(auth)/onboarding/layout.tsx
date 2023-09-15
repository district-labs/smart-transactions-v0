"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { faker } from "@faker-js/faker"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Icons } from "@/components/icons"

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const pathname = usePathname()

  const breadcrumbs = []
  for (let i = 0; i < siteConfig.onboardingSteps.length; i++) {
    if (siteConfig.onboardingSteps[i].href === pathname) {
      breadcrumbs.push({
        title: siteConfig.onboardingSteps[i].name,
        href: siteConfig.onboardingSteps[i].href,
      })
      break
    }
    breadcrumbs.push({
      title: siteConfig.onboardingSteps[i].name,
      href: siteConfig.onboardingSteps[i].href,
    })
  }

  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative hidden w-full flex-1 flex-col items-start justify-between bg-secondary px-8 py-6 lg:flex">
        <Link href="/" className="z-20 flex items-center space-x-2">
          <Icons.logo className=" h-10 w-10 text-primary" />
          <span className="inline-block text-xl font-bold uppercase">
            {siteConfig.name}
          </span>
        </Link>
        <div className="mx-auto flex w-full lg:max-w-xl">
          <ul className="space-y-6">
            {siteConfig.onboardingSteps.map((step, index) => (
              <li key={step.id} className="relative flex gap-x-4">
                <div
                  className={cn(
                    index === siteConfig.onboardingSteps.length - 1
                      ? "h-8"
                      : "-bottom-8",
                    "absolute left-0 top-0 flex w-6 justify-center"
                  )}
                >
                  <div className="ml-2 w-px bg-muted-foreground" />
                </div>
                <div className="relative flex h-8 w-8 flex-none items-center justify-center rounded-full bg-secondary">
                  <div
                    className={cn(
                      pathname === step.href ? "bg-primary" : "bg-background",
                      "h-4 w-4 rounded-full ring-1 ring-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <h2
                    className={cn(
                      pathname === step.href
                        ? "text-primary"
                        : "text-muted-foreground",
                      "flex-auto py-0.5 text-lg font-medium uppercase leading-7"
                    )}
                  >
                    {step.name}
                  </h2>
                  <Balancer
                    className={cn(
                      pathname === step.href
                        ? "text-foreground"
                        : "text-muted-foreground",
                      "text-sm"
                    )}
                  >
                    {step.description}
                  </Balancer>
                </div>
              </li>
            ))}
          </ul>
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
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <Breadcrumbs
          segments={breadcrumbs}
          className="absolute left-4 top-8 sm:left-6 sm:top-12 md:left-8 lg:hidden"
        />
        {children}
      </main>
    </div>
  )
}
