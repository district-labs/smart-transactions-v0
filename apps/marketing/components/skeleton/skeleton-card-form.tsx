import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@district-labs/ui-react"

export function SkeletonCardForm() {
  return (
    <Card className="rounded-lg bg-white p-4 shadow-md">
      <CardHeader>
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="flex flex-col justify-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-4 h-6 w-3/4" />
        <Skeleton className="mt-8 h-5 w-24" />
        <Skeleton className="mt-4 h-6 w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="mt-4 h-4 w-1/4" />
      </CardFooter>
    </Card>
  )
}
