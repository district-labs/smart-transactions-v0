"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const data = [
  {
    year: "2023",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    year: "2024",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    year: "2025",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    year: "2026",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    year: "2027",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    year: "2028",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export default function PotentialChart() {
  return (
    <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-10">
      <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-2 lg:mt-0 lg:max-w-none">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="strategy">Strategy</Label>
            <Select>
              <SelectTrigger id="strategy" className="w-56">
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum-dca">Ethereum DCA</SelectItem>
                <SelectItem value="Ethereum Mean Reversion">
                  Ethereum Mean Reversion
                </SelectItem>
                <SelectItem value="long-l2s">Long Layer 2s</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deposit">Initial Deposit</Label>
            <Input type="number" id="deposit" placeholder="1000" step="500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contributions">Monthly Contributions</Label>
            <Input
              type="number"
              id="contributions"
              placeholder="100"
              step="50"
            />
          </div>
          <Button>Calculate</Button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <ResponsiveContainer width="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="year"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar dataKey="total" fill="#047835" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
