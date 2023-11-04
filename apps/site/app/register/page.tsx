"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Image from "next/image"
import { CornerDownLeft } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { assets } from "@/lib/utils/asset-utils"
import { colors, type Color } from "@/lib/utils/color-utils"
import { FormUserRegister } from "@/components/forms/form-user-register"
import { Canvas } from "@/components/shared/canvas"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"
import { ButtonSiweSignIn } from "@/integrations/siwe/components/button-siwe-sign-in"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { WalletConnect } from "@/components/blockchain/wallet-connect"

// import { emailSchema } from "@/lib/validations"

type Inputs = any

export default function Register() {
  const [currentColor, setCurrentColor] = useState<Color>(colors[0])
  const [showStrategy, setShowStrategy] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    const rotateColors = () => {
      setCurrentColor(colors[currentIndex])
      currentIndex = (currentIndex + 1) % colors.length
    }
    const intervalId = setInterval(rotateColors, 2000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    async function animateStrategy() {
      await new Promise((resolve) => setTimeout(resolve, 2250))
      setShowStrategy(true)
    }
    animateStrategy()
  }, [])

  return (
    <section className="px-10">
      <div
        className={cn(
          "transition-color fixed inset-0 opacity-25 delay-100 duration-700",
          {
            "bg-purple-300": currentColor === "purple",
            "bg-sky-300": currentColor === "sky",
            "bg-yellow-300": currentColor === "yellow",
            "bg-teal-300": currentColor === "teal",
            "bg-blue-300": currentColor === "blue",
            "bg-green-300": currentColor === "green",
            "bg-orange-400": currentColor === "orange",
            "bg-red-300": currentColor === "red",
            "bg-neutral-300": currentColor === "neutral",
          }
        )}
      />
      <Image
        width={1200}
        height={1200}
        role="presentation"
        alt="gradient background"
        className="fixed inset-0 mx-auto h-screen w-screen object-cover"
        src={assets.gradient}
      />
      <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `url(${assets.square})`,
          backgroundSize: "30px",
        }}
      />
      <div
        className={cn(
          "duration-[1500ms] fixed inset-0 bg-black opacity-50 transition-opacity"
        )}
      />
      <div className="mx-auto mt-20 max-w-7xl">
        <div className="relative z-10 flex flex-col items-center">
          {/* <Image
            src="/district.png"
            alt="District"
            width={1287}
            height={264}
            className="mb-12 h-auto max-w-xs"
          /> */}
          <Image
            src="/district-globe.svg"
            height={100}
            width={100}
            alt="District"
            className=""
          />
          <h1 className="font-archivo mb-12 max-w-3xl text-center text-7xl font-bold leading-snug text-white">
            Investment Strategies{" "}
            <span
              className={cn("transition-colors duration-200", {
                "text-purple-300": currentColor === "purple",
                "text-sky-300": currentColor === "sky",
                "text-yellow-300": currentColor === "yellow",
                "text-teal-300": currentColor === "teal",
                "text-blue-300": currentColor === "blue",
                "text-green-300": currentColor === "green",
                "text-orange-400": currentColor === "orange",
                "text-red-300": currentColor === "red",
                "text-neutral-300": currentColor === "neutral",
              })}
            >
              Simplified
            </span>{" "}
          </h1>
          <p className="texty-center mb-8 text-xl text-gray-300">
            Unlock the full power of DeFi with District Finance
          </p>
          <IsWalletDisconnected>
            <WalletConnect />
          </IsWalletDisconnected>
          <IsWalletConnected>
            <IsSignedOut>
              <ButtonSiweSignIn  className="w-full max-w-[320px]" variant={"secondary"} label="Authenticate" />
            </IsSignedOut>
            <IsSignedIn>
              <FormUserRegister currentColor={currentColor} />
            </IsSignedIn>
          </IsWalletConnected>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="relative mx-auto mt-12 flex w-96 items-center rounded-md border border-white/25 bg-black px-2 py-3">
          <Image
            src="/district-globe.svg"
            height={44}
            width={44}
            alt="District"
            className="mr-2 h-6 w-6"
          />
          <p className="font-archivo relative w-[max-content] text-white delay-700 before:absolute before:inset-0 before:animate-typewriter before:bg-black after:absolute after:inset-0 after:w-[0.125em] after:animate-caret after:bg-white">
            Build a strategy bullish on Layer 2s
          </p>
          <CornerDownLeft className="ml-auto mr-1 h-4 w-4" />
        </div>
        {showStrategy && <Canvas showStrategy={showStrategy} />}
      </div>
    </section>
  )
}
