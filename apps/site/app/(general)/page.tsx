import Image from "next/image"
import Link from "next/link"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { LuBook } from "react-icons/lu"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen h-full relative flex flex-col bg-black">
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[url('/story/trading-terminal-4.png')] bg-cover bg-center blur-md bg-neutral-900 z-0 opacity-40" />
        <div className="h-full flex-1 flex flex-col justify-center">
          <div className="max-w-5xl relative mt-20 z-100 text-white lg:left-32">
            <div className="pb-8">
              <h3 className="font-bold text-5xl lg:text-8xl">
              Investment strategies simplified
              </h3>
              <h5 className="font-light text-2xl my-4">
                Explore new digital frontiers with friends and uncover what’s
                possible
              </h5>
              <p className="max-w-[720px]">
              District helps you transform your ideas into action with a no-code strategy builder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
