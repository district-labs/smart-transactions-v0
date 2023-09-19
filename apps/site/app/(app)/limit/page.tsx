"use client"

import { SelectValue } from "@radix-ui/react-select"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LimitOrderChart from "@/components/charts/limit-order-chart"
import { Icons } from "@/components/icons"
import { OpenOrdersTableShell } from "@/components/strategies/limit-order-table-shell"

const dummyData = [
  {
    sell: {
      asset: "Ether",
      amount: 2,
    },
    recieve: {
      asset: "USDC",
      amount: 4000,
    },
    limitPrice: "1000",
    expiry: "October 21, 2023",
    status: "open",
  },
  {
    sell: {
      asset: "Ether",
      amount: 2,
    },
    recieve: {
      asset: "USDC",
      amount: 4000,
    },
    limitPrice: "1000",
    expiry: "October 21, 2023",
    status: "open",
  },
]


export default function LimitPage() {
  return (
    <>
      <section className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-2xl tracking-tight sm:text-3xl">ETH/USDC</h2>
          <LimitOrderChart />
        </div>
        <Card>
          <CardContent className="grid gap-6 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="selling">You&apos;re selling</Label>
              <Input placeholder="0.0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="selling">Limit</Label>
                <Input placeholder="1000.0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="selling">Expiry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue defaultValue="1d" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  <Icons.arrowdown />
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selling">To recieve</Label>
              <Input placeholder="1.0" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Place Limit Order</Button>
          </CardFooter>
        </Card>
      </section>
      <section className="mt-10">
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <OpenOrdersTableShell data={dummyData} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}
