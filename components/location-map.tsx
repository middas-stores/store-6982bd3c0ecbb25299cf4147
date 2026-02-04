"use client"

import { MapPin } from "lucide-react"

interface LocationMapProps {
  address: string
  businessName: string
}

export function LocationMap({ address, businessName }: LocationMapProps) {
  if (!address) {
    return null
  }

  // Encode address for Google Maps embed URL
  const encodedAddress = encodeURIComponent(`${address}, Argentina`)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Ubicación</h3>
        </div>
        <p className="text-sm text-muted-foreground">{address}</p>
      </div>
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={`Ubicación de ${businessName}`}
        />
      </div>
      <div className="p-3 border-t border-border">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
        >
          <MapPin className="h-4 w-4" />
          Cómo llegar
        </a>
      </div>
    </div>
  )
}
