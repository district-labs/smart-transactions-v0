import * as React from "react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

type FormUserUpdateEmail = React.HTMLAttributes<HTMLElement>

export const FormUserUpdateEmail = ({
  children,
  className,
}: FormUserUpdateEmail) => {
  const classes = cn(className)

  return (
    <Card>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
