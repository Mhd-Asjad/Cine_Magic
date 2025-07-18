"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import apiAdmin from "@/axios/api"
import TheatreApi from "@/axios/theatreapi"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },

  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },

  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  }
}

export function ChartAreaInteractive() {
  const [ chartData, setChartData ] = React.useState([])
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("month")

  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await TheatreApi.get("theatre-revenue/",{
          params: {
            'period' : timeRange
          }
        })
        setChartData(response.data)
      }catch(error) {
        console.error("Error fetching chart data:", error)
      }
    }
    fetchChartData()
  },[timeRange])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "month") {
      daysToSubtract = 30
    } else if (timeRange === "week") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  console.log(chartData , 'time range in chard area interactive')

  return (
    (<Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Revnue Chart</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last one {timeRange}</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden">
            <ToggleGroupItem value="year" className="h-8 px-2.5">
              Last year
            </ToggleGroupItem>
            <ToggleGroupItem value="month" className="h-8 px-2.5">
              Last month
            </ToggleGroupItem>
            <ToggleGroupItem value="week" className="h-8 px-2.5">
              Last week
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="year" className="rounded-lg">
                Last year
              </SelectItem>
              <SelectItem value="month" className="rounded-lg">
                Last month
              </SelectItem>
              <SelectItem value="week" className="rounded-lg">
                Last week
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}

              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}

                  indicator="dot" />
              } />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a" />
            <Area
              dataKey="tickets"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>)
  );
}
