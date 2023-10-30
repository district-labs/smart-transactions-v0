"use client"

import { userProfileGet } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useUserProfileGet() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: userProfileGet,
  })
}
