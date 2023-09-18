"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { type User } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { siteConfig } from "@/config/site"
import { catchError } from "@/lib/utils"
import { userSchema } from "@/lib/validations/user"
import { updateUserAction } from "@/app/_actions/user"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"

interface UpdateUserFormProps {
  user: User
}

type Inputs = z.infer<typeof userSchema>

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<Inputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user.firstName ? user.firstName : "",
      lastName: user.lastName ? user.lastName : "",
      email: user.email ? user.email : "",
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await updateUserAction({
          ...data,
          id: user.id,
          address: user.address,
        })

        // Route to next step in onboarding
        router.push(siteConfig.onboardingSteps[1].href)
        toast({
          description: "Info updated successfully.",
        })
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                aria-invalid={!!form.formState.errors.firstName}
                placeholder="John"
                {...form.register("firstName")}
                defaultValue={user.firstName ? user.firstName : ""}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.firstName?.message}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                aria-invalid={!!form.formState.errors.lastName}
                placeholder="Wick"
                {...form.register("lastName")}
                defaultValue={user.lastName ? user.lastName : ""}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.lastName?.message}
            />
          </FormItem>
        </div>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.email}
              type="email"
              inputMode="email"
              placeholder="john@wick.com"
              {...form.register("email")}
              defaultValue={user.email ? user.email : ""}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.email?.message}
          />
        </FormItem>
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Confirm
          <span className="sr-only">Confirm details</span>
        </Button>
      </form>
    </Form>
  )
}