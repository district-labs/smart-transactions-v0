import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { env } from "@/env.mjs"
import { faker } from "@faker-js/faker"

import { siteConfig } from "@/config/site"
import { Profile } from "@/components/auth/login-button"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Login",
  description: "Log in to District to start investing.",
}

export default function LoginPage() {
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
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-2">
            <Icons.logo className="h-16 w-16 text-primary" />
            <h2 className="text-2xl font-bold leading-9 tracking-tight">
              Log in to your account
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Not in the club?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:text-primary/80"
              >
                Start with as little as $1.
              </Link>
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <Profile />
          </div>
        </div>
      </main>
    </div>
  )
}
