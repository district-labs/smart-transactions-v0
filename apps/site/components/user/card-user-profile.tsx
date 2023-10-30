import * as React from "react"
import { Card, CardContent, CardHeader } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"
import { useUserProfileGet } from "@/hooks/profile/use-user-profile-get"

type CardUserProfile = React.HTMLAttributes<HTMLElement>

export const CardUserProfile = ({ className }: CardUserProfile) => {
  const classes = cn(className)
  const { data: userProfile } = useUserProfileGet()

  return (
    <Card className={classes}>
      <CardHeader>
        <h3 className="text-2xl font-bold">Overview</h3>
      </CardHeader>
      <CardContent className="grid gap-y-5">
        <div className="">
          {userProfile?.firstName && (
            <h3 className="text-xl font-medium">
              {userProfile?.firstName} {userProfile?.lastName}
            </h3>
          )}
          {!userProfile?.firstName && (
            <h3 className="text-xl font-medium">Anonymous</h3>
          )}
        </div>
        <div className="">
          <span className="text-sm font-bold">Email</span>
          {userProfile?.email && (
            <h3 className="text-xl font-medium">{userProfile?.email}</h3>
          )}
          {!userProfile?.email && (
            <h3 className="text-xl font-normal">Unknown</h3>
          )}
        </div>
        {userProfile?.emailPreferences && (
          <div className="grid gap-y-4">
            <span className="text-sm font-bold">Email Preferences</span>
            <div className="flex items-center justify-between">
              <span className="text-sm">Smart Transactions</span>
              <span className="text-sm font-bold">
                {!!userProfile?.emailPreferences?.transactional
                  ? "Active"
                  : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Marketing</span>
              <span className="text-sm font-bold">
                {!!userProfile?.emailPreferences?.marketing
                  ? "Active"
                  : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Newsletter </span>
              <span className="text-sm font-bold">
                {!!userProfile?.emailPreferences?.newsletter
                  ? "Active"
                  : "Disabled"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
