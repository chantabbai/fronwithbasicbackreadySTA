"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Percent } from "lucide-react"

// Dummy data for the chart
const data = [
  { date: '2023-01-01', pnl: 1000 },
  { date: '2023-02-01', pnl: 1500 },
  { date: '2023-03-01', pnl: 1200 },
  { date: '2023-04-01', pnl: 1800 },
  { date: '2023-05-01', pnl: 2200 },
  { date: '2023-06-01', pnl: 2000 },
]

// Dummy performance metrics
const performanceMetrics = {
  totalTrades: 150,
  winRatio: 0.65,
  avgProfit: 120,
  biggestWin: 5000,
  biggestLoss: -2000,
  riskRewardRatio: 1.5,
}

export default function DashboardContent() {
  const [timeFrame, setTimeFrame] = useState('6M')

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Trading Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Profit/Loss Chart
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="ALL">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pnl" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Trades"
          value={performanceMetrics.totalTrades}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Win Ratio"
          value={`${(performanceMetrics.winRatio * 100).toFixed(2)}%`}
          icon={<Percent className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Avg. Profit per Trade"
          value={`$${performanceMetrics.avgProfit}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Biggest Win"
          value={`$${performanceMetrics.biggestWin}`}
          icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Biggest Loss"
          value={`$${performanceMetrics.biggestLoss}`}
          icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
        />
        <MetricCard
          title="Risk-Reward Ratio"
          value={performanceMetrics.riskRewardRatio.toFixed(2)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}