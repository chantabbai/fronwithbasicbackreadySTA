"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users
const dummyUsers = [
  { id: 'user1', email: 'user1@example.com', password: 'password1' },
  { id: 'user2', email: 'user2@example.com', password: 'password2' },
  { id: 'user3', email: 'user3@example.com', password: 'password3' },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const foundUser = dummyUsers.find(u => u.email === email && u.password === password)
    if (foundUser) {
      const { id, email } = foundUser
      const user = { id, email }
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    // In a real app, you'd implement actual password change logic here
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === 'wrongpassword') {
          reject(new Error('Current password is incorrect'))
        } else {
          resolve()
        }
      }, 1000)
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}