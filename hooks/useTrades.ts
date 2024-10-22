import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export type Trade = {
  id: string
  userId: string
  date: string
  symbol: string
  action: 'buy' | 'sell'
  quantity: number
  price: number
  type: 'stock' | 'option'
  optionType?: 'call' | 'put'
  strategy: string
  notes: string
  exitDate?: string
  exitPrice?: number
  profit?: number
  profitPercentage?: number
}

const API_URL = 'http://localhost:8080/api/trades';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTrades(user.id)
    } else {
      setTrades([])
    }
  }, [user])

  const fetchTrades = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch trades')
      }
      const data = await response.json()
      setTrades(data)
    } catch (error) {
      console.error('Error fetching trades:', error)
    }
  }

  const saveTrade = async (trade: Trade) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trade),
      })
      if (!response.ok) {
        throw new Error('Failed to save trade')
      }
      const savedTrade = await response.json()
      setTrades([...trades, savedTrade])
    } catch (error) {
      console.error('Error saving trade:', error)
    }
  }

  const updateTrade = async (id: string, updatedTrade: Trade) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTrade),
      })
      if (!response.ok) {
        throw new Error('Failed to update trade')
      }
      const updated = await response.json()
      setTrades(trades.map(t => t.id === id ? updated : t))
    } catch (error) {
      console.error('Error updating trade:', error)
    }
  }

  const deleteTrade = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete trade')
      }
      setTrades(trades.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting trade:', error)
    }
  }

  return { trades, saveTrade, updateTrade, deleteTrade }
}