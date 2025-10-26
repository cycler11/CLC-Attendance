"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Users, Settings, LogOut } from "lucide-react"
import { StatsOverview } from "@/components/stats-overview"
import { EventsManager } from "@/components/events-manager"
import { AttendeesTable } from "@/components/attendees-table"
import { NotionSettings } from "@/components/notion-settings"
import { setAuthenticated } from "@/lib/auth"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleLogout = () => {
    setAuthenticated(false)
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-balance">Caltech Longevity Club</h1>
              <p className="text-sm text-muted-foreground">Event Attendance Tracker</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="attendees" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Attendees</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsManager />
          </TabsContent>

          <TabsContent value="attendees" className="space-y-6">
            <AttendeesTable />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <NotionSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
