"use client"

import { getAuthUserApi, putUserApi } from "@district-labs/intentify-api-actions"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Form,
  FormField,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "@district-labs/ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { useUserProfileGet } from "@/hooks/profile/use-user-profile-get"
import { updateEmailPreferencesSchema } from "@/lib/validations/email"

import { toast } from "@district-labs/ui-react"
import { Icons } from "../icons"

type EmailPreferencesInput = z.infer<typeof updateEmailPreferencesSchema>

export function FormUserEmailPreferences() {
  const queryClient = useQueryClient()
  const { data: userProfile, isSuccess: userProfileIsSuccess } =
    useUserProfileGet()

  const form = useForm<EmailPreferencesInput>({
    resolver: zodResolver(updateEmailPreferencesSchema),
  })

  useEffect(() => {
    if (userProfile) {
      form.setValue("transactional", userProfile?.emailPreferences.transactional || undefined)
      form.setValue("marketing", userProfile.emailPreferences.marketing || undefined)
      form.setValue("newsletter", userProfile.emailPreferences.newsletter || undefined)
    }
  }, [userProfileIsSuccess, userProfile, form])

  const updateUserMutation = useMutation({
    mutationFn: async (data: EmailPreferencesInput) => {
      const userAuth =  await getAuthUserApi()
      if(!userAuth) throw new Error("User not found")

      return putUserApi({
        address: userAuth?.address,
        emailPreferences: {
          userId: userAuth?.address,
         ...data
        },
      })
     
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"])
      toast({
        description: "Email preferences update successful.",
      })
    },
  })

  function onSubmit({
    transactional,
    marketing,
    newsletter,
  }: EmailPreferencesInput) {
    updateUserMutation.mutate({
      transactional,
      marketing,
      newsletter,
    })
  }

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-2xl font-bold">Email Preferences</h3>
          </CardHeader>
          <CardContent>
            <div className="grid gap-y-2">
              {/* Transactional */}
              <FormField
                control={form.control}
                name="transactional"
                render={({ field }) => (
                  <FormItem>
                    <Checkbox
                      aria-invalid={!!form.formState.errors.transactional}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <UncontrolledFormMessage
                      message={form.formState.errors.transactional?.message}
                    />
                    <FormLabel className="ml-2">
                      Smart Transactions{" "}
                      <span className="text-xs">
                        (Notification when an intent is executed or cancelled)
                      </span>
                    </FormLabel>
                  </FormItem>
                )}
              />
              {/* Marketing */}
              <FormField
                control={form.control}
                name="marketing"
                render={({ field }) => (
                  <FormItem>
                    <Checkbox
                      aria-invalid={!!form.formState.errors.transactional}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <UncontrolledFormMessage
                      message={form.formState.errors.transactional?.message}
                    />
                    <FormLabel className="ml-2">Marketing</FormLabel>
                  </FormItem>
                )}
              />
              {/* Newsletter */}
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem>
                    <Checkbox
                      aria-invalid={!!form.formState.errors.transactional}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <UncontrolledFormMessage
                      message={form.formState.errors.transactional?.message}
                    />
                    <FormLabel className="ml-2">Newsletter</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-card-footer py-4">
            <Button disabled={updateUserMutation.isLoading}>
              {updateUserMutation.isLoading && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Update
              <span className="sr-only">Confirm details</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
