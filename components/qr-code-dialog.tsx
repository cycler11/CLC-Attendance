"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Copy, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  pointsValue: number
}

interface QRCodeDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QRCodeDialog({ event, open, onOpenChange }: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  const checkInUrl = `http://andreiabramov.com/checkin/${event.id}`

  useEffect(() => {
    if (open && !qrDataUrl) {
      generateQRCode()
    }
  }, [open])

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const dataUrl = await QRCode.toDataURL(checkInUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#ea580c",
          light: "#ffffff",
        },
      })
      setQrDataUrl(dataUrl)

      // Also render to canvas for download functionality
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, checkInUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#ea580c",
            light: "#ffffff",
          },
        })
      }
    } catch (error) {
      console.error("[v0] QR Code generation error:", error)
      toast({
        title: "QR Code Generation Error",
        description: "Failed to create QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    canvasRef.current.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `qr-${event.name.replace(/\s+/g, "-").toLowerCase()}.png`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "QR Code Downloaded",
        description: "QR code saved to your device",
      })
    })
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(checkInUrl)
    toast({
      title: "URL Copied",
      description: "Check-in link copied to clipboard",
    })
  }

  const handleOpenUrl = () => {
    window.open(checkInUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.name}</DialogTitle>
          <DialogDescription>Scan QR code to check in to the event</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center items-center p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/20 min-h-[340px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-3">
                <img src={qrDataUrl || "/placeholder.svg"} alt="QR Code" className="w-[300px] h-[300px]" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button onClick={handleDownload} className="flex-1" disabled={!qrDataUrl}>
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
              <Button onClick={handleCopyUrl} variant="outline" className="flex-1 bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
            </div>

            <Button onClick={handleOpenUrl} variant="secondary" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Check-in Page
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground break-all font-mono">{checkInUrl}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
