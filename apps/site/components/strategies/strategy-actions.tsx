import { type Strategy } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StrategyActionsProps {
  strategy: Partial<Strategy>
}

export default function StrategyActions({ strategy }: StrategyActionsProps) {
  return (
    <Tabs defaultValue="invest" className="col-span-3 h-fit lg:col-span-1">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="invest">Invest</TabsTrigger>
        <TabsTrigger value="exit">Exit</TabsTrigger>
      </TabsList>
      <TabsContent value="invest">
        <Card>
          <CardHeader>
            <CardTitle className="leading-normal">{`Invest in ${strategy.name} strategy`}</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              {/* <Label htmlFor="deposit">
                {toTitleCase(strategy?.coins?.[0])} Deposit{" "}
              </Label> */}
              <Input id="deposit" type="number" placeholder="0.0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="limit-price">Limit Price</Label>
                <Input id="limit-price" type="number" placeholder="0.0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deviation-level">Expiry</Label>
                <Select defaultValue="7-day">
                  <SelectTrigger
                    id="deviation-level"
                    className="line-clamp-1 w-[160px] truncate"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-min">5 Minutes</SelectItem>
                    <SelectItem value="30-min">30 Minutes</SelectItem>
                    <SelectItem value="1-hour">1 Hour</SelectItem>
                    <SelectItem value="1-day">1 Day</SelectItem>
                    <SelectItem value="3-day">3 Days</SelectItem>
                    <SelectItem value="7-day">7 Days</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full">Invest</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="exit">
        <Card>
          <CardHeader>
            <CardTitle className="leading-normal">{`Exit ${strategy.name} strategy`}</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deposit">Deposit Amount</Label>
                <Input id="deposit" type="number" placeholder="1000 USDC" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deviation-level">Deviation Level</Label>
                <Select defaultValue="3">
                  <SelectTrigger
                    id="deviation-level"
                    className="line-clamp-1 w-[160px] truncate"
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1%</SelectItem>
                    <SelectItem value="3">3%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="destructive" className="w-full">
              Exit
            </Button>
          </CardContent>
          <CardFooter className="flex w-full flex-col gap-y-2 border-t pt-2 text-sm">
            <div className="flex w-full items-center justify-between">
              <p>Platform Fee: </p>
              {/* <p>{`${strategy.platformFee}%`}</p> */}
            </div>
            <div className="flex w-full items-center justify-between">
              <p>Performance Fee: </p>
              {/* <p>{`${strategy.performanceFee}%`}</p> */}
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
