"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Attendee {
  id: string
  email: string
  fullName: string
  totalPoints: number
  eventsAttended: number
  createdAt: string
}

export function AttendeesTable() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendees()
  }, [])

  const fetchAttendees = async () => {
    try {
      const response = await fetch("/api/attendees")
      const data = await response.json()
      setAttendees(data)
    } catch (error) {
      console.error("[v0] Failed to fetch attendees:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Events Attended", "Total Points", "Joined Date"]
    const rows = attendees.map((a) => [
      a.fullName,
      a.email,
      a.eventsAttended.toString(),
      a.totalPoints.toString(),
      new Date(a.createdAt).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendees-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="text-center py-8">Loading attendees...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Attendees</CardTitle>
            <CardDescription>Complete list of registered members</CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm" disabled={attendees.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {attendees.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No attendees yet</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Events Attended</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{attendee.email}</TableCell>
                    <TableCell className="text-right">{attendee.eventsAttended}</TableCell>
                    <TableCell className="text-right font-semibold">{attendee.totalPoints}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(attendee.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
