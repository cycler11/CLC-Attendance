"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Calendar, MapPin, Award } from "lucide-react"

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  pointsValue: number
}

interface CheckInFormProps {
  event: Event
}

export function CheckInForm({ event }: CheckInFormProps) {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [pointsAwarded, setPointsAwarded] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          email,
          fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to check in")
        return
      }

      setPointsAwarded(data.pointsAwarded)
      setSuccess(true)
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-balance">Check-in Successful!</CardTitle>
          <CardDescription className="text-base">You've been registered for this event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <span className="text-3xl font-bold text-indigo-600">{pointsAwarded}</span>
            </div>
            <p className="text-sm text-muted-foreground">Points Earned</p>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-center text-muted-foreground">
              Thank you for attending <span className="font-semibold text-foreground">{event.name}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-2xl text-balance">{event.name}</CardTitle>
          {event.description && <CardDescription className="text-base">{event.description}</CardDescription>}
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Award className="w-4 h-4" />
            <span>{event.pointsValue} points</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Caltech Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jdoe@caltech.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Must be a valid @caltech.edu email address</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking in..." : "Check In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
