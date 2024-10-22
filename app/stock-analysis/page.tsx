"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowUpIcon, ArrowDownIcon, AlertTriangle } from 'lucide-react'

// Dummy data for valuation and risk tabs
const stockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  peRatio: 28.5,
  pegRatio: 1.5,
  dividendYield: 0.65,
  payoutRatio: 15.8,
  beta: 1.2,
  standardDeviation: 0.35,
}

type UserInputs = {
  initialInvestment: number
  recurringInvestment: number
  recurringFrequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  dividendGrowthRate: number
  expectedStockReturn: number
  projectionYears: number
}

export default function StockAnalysis() {
  const [symbol, setSymbol] = useState('')
  const [userInputs, setUserInputs] = useState<UserInputs>({
    initialInvestment: 10000,
    recurringInvestment: 0,
    recurringFrequency: 'monthly',
    dividendGrowthRate: 5,
    expectedStockReturn: 7,
    projectionYears: 10,
  })
  const [projections, setProjections] = useState<any[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleFrequencyChange = (value: 'weekly' | 'biweekly' | 'monthly' | 'yearly') => {
    setUserInputs(prev => ({ ...prev, recurringFrequency: value }))
  }

  const handleAnalyze = () => {
    // In a real app, this would fetch data from an API
    console.log('Analyzing stock:', symbol)
    calculateProjections()
  }

  const calculateProjections = () => {
    const {
      initialInvestment,
      recurringInvestment,
      recurringFrequency,
      dividendGrowthRate,
      expectedStockReturn,
      projectionYears,
    } = userInputs

    const frequencyMultiplier = {
      weekly: 52,
      biweekly: 26,
      monthly: 12,
      yearly: 1,
    }

    let currentShares = initialInvestment / stockData.price
    let currentDividendPerShare = stockData.price * (stockData.dividendYield / 100)

    const projections = []

    for (let year = 1; year <= projectionYears; year++) {
      const yearlyRecurringInvestment = recurringInvestment * frequencyMultiplier[recurringFrequency]
      const additionalShares = yearlyRecurringInvestment / stockData.price
      currentShares += additionalShares

      const stockValue = currentShares * stockData.price * Math.pow(1 + expectedStockReturn / 100, year)
      const dividendIncome = currentShares * currentDividendPerShare
      const totalValue = stockValue + dividendIncome

      projections.push({
        year,
        stockValue,
        dividendIncome,
        totalValue,
        shares: currentShares,
      })

      currentDividendPerShare *= (1 + dividendGrowthRate / 100)
    }

    setProjections(projections)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Stock Analysis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Enter Stock Symbol and Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
              <Input
                id="initialInvestment"
                name="initialInvestment"
                type="number"
                value={userInputs.initialInvestment}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="recurringInvestment">Recurring Investment ($)</Label>
              <Input
                id="recurringInvestment"
                name="recurringInvestment"
                type="number"
                value={userInputs.recurringInvestment}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
              <Select value={userInputs.recurringFrequency} onValueChange={handleFrequencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dividendGrowthRate">Expected Dividend Growth Rate (%)</Label>
              <Input
                id="dividendGrowthRate"
                name="dividendGrowthRate"
                type="number"
                value={userInputs.dividendGrowthRate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="expectedStockReturn">Expected Annual Stock Return (%)</Label>
              <Input
                id="expectedStockReturn"
                name="expectedStockReturn"
                type="number"
                value={userInputs.expectedStockReturn}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="projectionYears">Projection Years</Label>
              <Input
                id="projectionYears"
                name="projectionYears"
                type="number"
                value={userInputs.projectionYears}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAnalyze}>Analyze</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="valuation">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="valuation">
          <ValuationTab data={stockData} />
        </TabsContent>
        <TabsContent value="dividends">
          <DividendsTab data={stockData} projections={projections} />
        </TabsContent>
        <TabsContent value="projections">
          <ProjectionsTab data={projections} />
        </TabsContent>
        <TabsContent value="risk">
          <RiskTab data={stockData} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <AlertTriangle className="inline-block mr-2" size={16} />
            The information provided is for educational purposes only. Stock analysis and projections are speculative and not guarantees of future performance. Always conduct your own research before making investment decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ValuationTab({ data }: { data: typeof stockData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Valuation - {data.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Current Price</Label>
            <p className="text-2xl font-bold">${data.price.toFixed(2)}</p>
          </div>
          <div>
            <Label>P/E Ratio</Label>
            <p className="text-2xl font-bold">{data.peRatio.toFixed(2)}</p>
          </div>
          <div>
            <Label>PEG Ratio</Label>
            <p className="text-2xl font-bold">{data.pegRatio.toFixed(2)}</p>
          </div>
          <div>
            <Label>Dividend Yield</Label>
            <p className="text-2xl font-bold">{data.dividendYield.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DividendsTab({ data, projections }: { data: typeof stockData, projections: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend Analysis - {data.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Current Dividend Yield</Label>
            <p className="text-2xl font-bold">{data.dividendYield.toFixed(2)}%</p>
          </div>
          <div>
            <Label>Payout Ratio</Label>
            <p className="text-2xl font-bold">{data.payoutRatio.toFixed(2)}%</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Projected Dividend Growth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dividendIncome" name="Dividend Income" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectionsTab({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Future Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockValue" fill="#8884d8" name="Stock Value" />
              <Bar dataKey="dividendIncome" fill="#82ca9d" name="Dividend Income" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Year</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Stock Value</th>
              <th className="text-right">Dividend Income</th>
              <th className="text-right">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td className="text-right">{item.shares.toFixed(2)}</td>
                <td className="text-right">${item.stockValue.toFixed(2)}</td>
                <td className="text-right">${item.dividendIncome.toFixed(2)}</td>
                <td className="text-right">${item.totalValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function RiskTab({ data }: { data: typeof stockData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment - {data.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Beta</Label>
            <p className="text-2xl font-bold">{data.beta.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {data.beta > 1 ? (
                <><ArrowUpIcon className="inline" size={16} /> Higher volatility than the market</>
              ) : (
                <><ArrowDownIcon className="inline" size={16} /> Lower volatility than the market</>
              )}
            </p>
          </div>
          <div>
            <Label>Standard Deviation</Label>
            <p className="text-2xl font-bold">{data.standardDeviation.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Measure of stock's volatility</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}