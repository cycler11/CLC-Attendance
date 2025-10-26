"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EventsList } from "@/components/events-list"
import { CreateEventDialog } from "@/components/create-event-dialog"

export function EventsManager() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEventCreated = () => {
    setShowCreateDialog(false)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Create and manage your events</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EventsList key={refreshKey} onEventUpdated={() => setRefreshKey((prev) => prev + 1)} />
        </CardContent>
      </Card>

      <CreateEventDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={handleEventCreated} />
    </div>
  )
}
