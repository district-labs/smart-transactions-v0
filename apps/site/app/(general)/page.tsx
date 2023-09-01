import Image from "next/image"
import Link from "next/link"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { LuBook } from "react-icons/lu"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"

export default function HomePage() {
  return (
    <div className="container relative mt-20">
      <PageHeader className="pb-8">
        <Image
          src="/logo-fill.png"
          alt="TurboETH Logo"
          width={80}
          height={80}
          className="w-20 h-20"
        />
        <PageHeaderHeading>Build Web3 in Turbo&nbsp;Mode</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
  </PageHeader>
    </div>
  )
}
