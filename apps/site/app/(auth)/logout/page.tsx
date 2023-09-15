import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { env } from "@/env.mjs"
import { faker } from "@faker-js/faker"

import { siteConfig } from "@/config/site"
import { LogOutButtons } from "@/components/auth/logout-buttons"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Log out",
  description: "Log out of your account.",
}

export default function LogOutPage() {
  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative hidden w-full flex-1 items-start justify-between bg-secondary/70 px-8 py-6 lg:flex lg:flex-col">
        <Link href="/" className="z-20 flex items-center space-x-2">
          <Icons.logo className=" h-10 w-10 stroke-primary text-primary" />
          <span className="inline-block text-xl font-bold uppercase">
            {siteConfig.name}
          </span>
        </Link>
        <Image
          src="/images/auth-layout.webp"
          alt="District geodesic dome"
          width={577}
          height={571}
          className="mx-auto"
        />
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
      <main className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-2 lg:w-96">
          <h2 className="text-2xl font-bold leading-9 tracking-tight">
            Log out
          </h2>
          <p className="pb-4 text-base leading-6 text-muted-foreground">
            Are you sure you want to sign out?
          </p>
          <LogOutButtons />
        </div>
      </main>
    </div>
  )
}
