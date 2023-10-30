import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Skeleton,
} from "@district-labs/ui-react"

export function SkeletonCardBasic() {
  return (
    <Card className="rounded-lg bg-white p-4 shadow-md">
      <CardHeader>
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="flex justify-center">
        <Skeleton className="h-24 w-24" />
      </CardContent>
      <CardDescription>
        <Skeleton className="mx-auto mt-4 h-4 w-3/4" />
        <Skeleton className="mx-auto mt-2 h-4 w-1/2" />
      </CardDescription>
    </Card>
  )
}
