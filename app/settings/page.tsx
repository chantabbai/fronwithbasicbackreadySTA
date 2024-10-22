"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/context/AuthContext'

export default function Settings() {
  const [riskPerTrade, setRiskPerTrade] = useState('1')
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { toast } = useToast()
  const { changePassword } = useAuth()

  const handleSaveSettings = () => {
    if (!riskPerTrade) {
      toast({
        title: "Error",
        description: "Please enter a valid risk per trade percentage.",
        variant: "destructive",
      })
      return
    }
    // Here you would typically save these settings to a backend or local storage
    console.log('Saving settings:', { riskPerTrade, emailNotifications, darkMode })
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    // New password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(newPassword)) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long and contain at least 1 capital letter, 1 number, and 1 special character.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      await changePassword(currentPassword, newPassword)
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while changing the password.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Trading Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
            <Input
              id="riskPerTrade"
              value={riskPerTrade}
              onChange={(e) => setRiskPerTrade(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
            <Label htmlFor="emailNotifications">Email Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="darkMode">Dark Mode</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Password must be at least 8 characters long and contain at least 1 capital letter, 1 number, and 1 special character.
          </p>
          <Button onClick={handleChangePassword} disabled={isChangingPassword}>
            {isChangingPassword ? "Changing Password..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </div>
  )
}