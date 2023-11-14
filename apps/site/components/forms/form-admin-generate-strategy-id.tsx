"use client"

import { useEffect, useState } from "react"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import { env } from "@/env.mjs"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  Input,
} from "@district-labs/ui-react"
import { useForm } from "react-hook-form"
import { keccak256, toHex } from "viem"

import { useUserProfileGet } from "@/hooks/profile/use-user-profile-get"

export function FormAdminGenerateStrategyId() {
  useUserProfileGet()

  const form = useForm()

  const [strategyId, setStrategyId] = useState<string>("0x00")
  function onSubmit({ strategyName }: any) {
    const strategyId = keccak256(toHex(strategyName))
    setStrategyId(strategyId)
  }

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-2xl font-bold">Generate Strategy ID</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Strategy Intent Modules</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.firstName}
                    placeholder="RecurringPayment"
                    {...form.register("strategyName")}
                  />
                </FormControl>
              </FormItem>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-card-footer py-4">
            <Button>Generate</Button>
            {<span className="font-bold">{strategyId}</span>}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
