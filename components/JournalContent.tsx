"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTrades, Trade } from '@/hooks/useTrades'
import { useAuth } from '@/context/AuthContext'

export default function JournalContent() {
  const { user } = useAuth()
  const { trades, saveTrade, updateTrade, deleteTrade } = useTrades()
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    date: '',
    symbol: '',
    action: 'buy',
    quantity: 0,
    price: 0,
    type: 'stock',
    strategy: '',
    notes: '',
  })
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [exitingTrade, setExitingTrade] = useState<Trade | null>(null)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTrade(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTrade(prev => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setNewTrade(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTrade = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a trade.",
        variant: "destructive",
      })
      return
    }

    if (!newTrade.symbol || !newTrade.action || !newTrade.quantity || !newTrade.price || !newTrade.type || !newTrade.strategy || !newTrade.date) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }
    if (newTrade.type === 'option' && !newTrade.optionType) {
      toast({
        title: "Error",
        description: "Please select an option type (Call or Put).",
        variant: "destructive",
      })
      return
    }
    const trade: Trade = {
      ...newTrade,
      userId: user.id,
      quantity: Number(newTrade.quantity),
      price: Number(newTrade.price),
      date: newTrade.date,
    } as Trade
    saveTrade(trade)
    setNewTrade({
      date: '',
      symbol: '',
      action: 'buy',
      quantity: 0,
      price: 0,
      type: 'stock',
      strategy: '',
      notes: '',
    })
    toast({
      title: "Trade Added",
      description: "Your trade has been successfully added to the journal.",
    })
  }

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade)
  }

  const handleUpdateTrade = () => {
    if (editingTrade) {
      updateTrade(editingTrade.id, editingTrade)
      setEditingTrade(null)
      toast({
        title: "Trade Updated",
        description: "Your trade has been successfully updated.",
      })
    }
  }

  const handleExitTrade = (trade: Trade) => {
    setExitingTrade(trade)
  }

  const handleRecordExit = () => {
    if (exitingTrade && exitingTrade.exitDate && exitingTrade.exitPrice) {
      const updatedTrade = {
        ...exitingTrade,
        exitDate: exitingTrade.exitDate,
        exitPrice: Number(exitingTrade.exitPrice),
        profit: (Number(exitingTrade.exitPrice) - exitingTrade.price) * exitingTrade.quantity,
        profitPercentage: ((Number(exitingTrade.exitPrice) - exitingTrade.price) / exitingTrade.price) * 100,
      }
      updateTrade(updatedTrade.id, updatedTrade)
      setExitingTrade(null)
      toast({
        title: "Exit Recorded",
        description: "Your trade exit has been successfully recorded.",
      })
    }
  }

  const openTrades = trades.filter(trade => !trade.exitDate)
  const closedTrades = trades.filter(trade => trade.exitDate)

  // ... rest of the component remains the same
}

// ... TradeTable component remains the same