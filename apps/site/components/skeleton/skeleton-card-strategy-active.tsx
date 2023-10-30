import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@district-labs/ui-react"

export function SkeletonCardStrategyActive() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="mt-4 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-x-5">
          <div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-4 h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-4 h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-4 h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-4 h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-card-footer py-8">
        <Skeleton className="h-4 w-1/4" />
      </CardFooter>
    </Card>
  )
}
