"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Trash2, Calendar, MapPin, Award } from "lucide-react"
import { QRCodeDialog } from "@/components/qr-code-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  pointsValue: number
  createdAt: string
}

interface EventsListProps {
  onEventUpdated: () => void
}

export function EventsList({ onEventUpdated }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("[v0] Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowQR = (event: Event) => {
    setSelectedEvent(event)
    setShowQRDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteEventId) return

    try {
      const response = await fetch(`/api/events/${deleteEventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== deleteEventId))
        onEventUpdated()
      }
    } catch (error) {
      console.error("[v0] Failed to delete event:", error)
    } finally {
      setDeleteEventId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No events yet. Create your first event to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{event.name}</div>
                    {event.description && <div className="text-sm text-muted-foreground">{event.description}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-3 h-3" />
                    {event.pointsValue}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleShowQR(event)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteEventId(event.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedEvent && <QRCodeDialog event={selectedEvent} open={showQRDialog} onOpenChange={setShowQRDialog} />}

      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This will also remove all associated attendance records. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
