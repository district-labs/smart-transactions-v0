import * as React from "react"

import { cn } from "@/lib/utils"

import { useTeamsFind } from "./hooks/use-teams-find"

type TeamsList = React.HTMLAttributes<HTMLElement> & {
  Render: any
}

export const TeamsList = ({ className, Render }: TeamsList) => {
  const classes = cn(className)
  const { data, isSuccess } = useTeamsFind({ filters: {} })

  console.log(data, "datadata")

  if (!isSuccess) return null

  if (isSuccess && data.length === 0) return <div>No teams found</div>

  if (isSuccess && data.length > 0 && Render)
    return (
      <div className={classes}>
        {data.map((team: any) => {
          return <Render key={team.id} {...team} />
        })}
      </div>
    )

  return null
}
