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
      <div className="min-h-screen h-full relative flex flex-col">
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[url('/story/home.png')] bg-cover bg-center bg-neutral-900 z-0" />
        <div className="h-full flex-1 flex flex-col justify-center">
          <div className="max-w-5xl relative mt-20 z-100 text-white lg:left-32">
            <div className="pb-8">
              <h3 className="font-bold text-5xl lg:text-8xl">
                Capture the Flag
              </h3>
              <h5 className="font-light text-2xl my-4">
                Explore new digital frontiers with friends and uncover what’s
                possible
              </h5>
              <p className="max-w-[620px]">
                Donec viverra in urna a posuere. Vestibulum egestas diam lacinia
                enim gravida molestie. Maecenas nunc neque, mattis sed tortor
                vitae.
              </p>
            </div>
          </div>
          <div className="absolute bottom-10 right-10">
            <Button>Start Game</Button>
          </div>
        </div>
      </div>
      <SectionHowItWorks />
    </>
  )
}

const SectionHowItWorks = (props) => {
  return (
    <section className="bg-neutral-800 z-10 py-32">
      <div className="max-w-5xl container relative z-100 text-white">
        <div className="pb-8 text-center">
          <h3 className="font-bold text-5xl lg:text-8xl">Uncover <br/> What's Possible</h3>
          <h5 className="font-bold text-2xl my-4">
            Work together to solve puzzles and unlock new digital frontiers.
          </h5>
          <p className="max-w-[620px] mx-auto">
            Donec viverra in urna a posuere. Vestibulum egestas diam lacinia
            enim gravida molestie. Maecenas nunc neque, mattis sed tortor vitae.
          </p>
        </div>
      </div>
    </section>
  )
}
