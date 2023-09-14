"use client"

import { useEffect, useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const features = [
  {
    name: "01. Build a strategy",
    description: "Create an algorithmic strategy that reacts to the market",
  },
  {
    name: "02. Simulate performance",
    description:
      "Test your trading strategy in real time based on historical data.",
  },
  {
    name: "03. Execute performance",
    description:
      "District executes your strategy automatically, so you'll never miss an opportunity.",
  },
]

const items = [
  {
    value: "build",
    name: "Build a strategy",
    content: "Build a strategy text. This is awesome.",
  },
  {
    value: "simulate",
    name: "Simulate performance",
    content: "Simulate how your strategy has performed.",
  },
  {
    value: "execute",
    name: "Execute intents",
    content: "Autmate execution of your strategies.",
  },
]

interface IntentsAccordionProps {
  timeout?: number
}

export function IntentsAccordion({ timeout = 5000 }: IntentsAccordionProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = setTimeout(
      () => setCurrentItemIndex((currentItemIndex + 1) % items.length),
      timeout
    )
    setProgress(0)
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 1
      )
    }, timeout / 100)

    return () => {
      clearInterval(id)
      clearInterval(timer)
    }
  }, [currentItemIndex, timeout])

  return (
    <div className="h-60">
      <Accordion
        type="single"
        collapsible
        className="mt-10 max-w-xl leading-7 lg:max-w-none"
        value={features[currentItemIndex].name}
        defaultValue={features[0].name}
      >
        {features.map((feature, index) => (
          <AccordionItem
            key={index}
            value={feature.name}
            progress={currentItemIndex === index && progress}
          >
            <AccordionTrigger className="text-base">
              {feature.name}
            </AccordionTrigger>
            <AccordionContent>{feature.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
