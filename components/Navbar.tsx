"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart2, BookOpen, DollarSign, Home, Settings, LogIn, LogOut, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/valuation', label: 'Valuation', icon: DollarSign },
  { href: '/stock-analysis', label: 'Stock Analysis', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <nav className="flex justify-between items-center p-4 bg-background shadow-sm">
      <Link href="/" className="text-2xl font-bold text-primary">TradePro</Link>
      <div className="flex items-center space-x-4">
        {user && pathname !== '/' && (
          <Link href="/" passHref>
            <Button variant="ghost" className="flex items-center" asChild>
              <span>
                <Home className="w-4 h-4 mr-2" />
                Home
              </span>
            </Button>
          </Link>
        )}
        {user && navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className="flex items-center"
              asChild
            >
              <span>
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </span>
            </Button>
          </Link>
        ))}
        {user ? (
          <Button variant="outline" className="flex items-center" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        ) : (
          <Link href="/auth/login" passHref>
            <Button variant="outline" className="flex items-center" asChild>
              <span>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </span>
            </Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </nav>
  )
}