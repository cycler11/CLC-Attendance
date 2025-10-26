"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2, ExternalLink, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotionSettings() {
  const [apiKey, setApiKey] = useState("")
  const [databaseId, setDatabaseId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/notion/settings")
      const data = await response.json()
      setIsConnected(data.isConnected)
      if (data.databaseId) {
        setDatabaseId(data.databaseId)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Notion settings:", error)
    }
  }

  const handleTest = async () => {
    if (!apiKey || !databaseId) {
      setTestResult({
        success: false,
        message: "Please provide both API key and database ID",
      })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/notion/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, databaseId }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          message: `Successfully connected to: ${data.databaseName}`,
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || "Connection failed",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Network error. Please try again.",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    if (!apiKey || !databaseId) {
      toast({
        title: "Error",
        description: "Please provide both API key and database ID",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/notion/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, databaseId }),
      })

      if (response.ok) {
        setIsConnected(true)
        toast({
          title: "Settings Saved",
          description: "Notion integration is now active. Check-ins will be synced automatically.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/notion/settings", {
        method: "DELETE",
      })

      if (response.ok) {
        setIsConnected(false)
        setApiKey("")
        setDatabaseId("")
        setTestResult(null)
        toast({
          title: "Disconnected",
          description: "Notion integration has been disabled",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Notion integration is optional.</strong> The app works perfectly without it. All data is stored in
          memory. Connect to Notion only if you want permanent backup of attendance records.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notion Integration (Optional)</CardTitle>
              <CardDescription>
                Optionally sync attendance data to your Notion database for permanent storage
              </CardDescription>
            </div>
            {isConnected && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription className="space-y-2">
              <p className="font-medium">Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Create an integration at{" "}
                  <a
                    href="https://www.notion.so/my-integrations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    notion.so/my-integrations
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Copy the Internal Integration Token (API Key)</li>
                <li>
                  Create a database in Notion with these properties: Name (title), Email (email), Event (text), Points
                  (number), Date (date)
                </li>
                <li>Share the database with your integration</li>
                <li>
                  Copy the database ID from the URL (the part after the workspace name and before the question mark)
                </li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Notion API Key (Internal Integration Token)</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="secret_xxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isConnected}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="databaseId">Database ID</Label>
              <Input
                id="databaseId"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={databaseId}
                onChange={(e) => setDatabaseId(e.target.value)}
                disabled={isConnected}
              />
              <p className="text-xs text-muted-foreground">
                Found in your database URL: notion.so/workspace/[DATABASE_ID]?v=...
              </p>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <AlertDescription>{testResult.message}</AlertDescription>
                </div>
              </Alert>
            )}

            <div className="flex gap-2">
              {!isConnected ? (
                <>
                  <Button onClick={handleTest} variant="outline" disabled={testing || !apiKey || !databaseId}>
                    {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Test Connection
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !apiKey || !databaseId || (testResult && !testResult.success)}
                  >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save & Enable
                  </Button>
                </>
              ) : (
                <Button onClick={handleDisconnect} variant="destructive">
                  Disconnect
                </Button>
              )}
            </div>
          </div>

          {isConnected && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                Notion integration is active. All new check-ins will be automatically synced to your Notion database.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            When a student checks in to an event, the following information is automatically sent to your Notion
            database:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Student's full name</li>
            <li>Caltech email address</li>
            <li>Event name</li>
            <li>Points awarded</li>
            <li>Check-in timestamp</li>
          </ul>
          <p className="pt-2">
            This allows you to maintain a permanent record of all attendance in Notion, even if you restart the
            application or clear the in-memory storage.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
