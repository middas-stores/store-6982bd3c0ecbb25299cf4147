"use client"

import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"
import { BusinessHours } from "./business-hours"
import { LocationMap } from "./location-map"

const DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function Footer() {
  const [config, setConfig] = useState<StoreConfig | null>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  if (!config) return null

  const showBusinessHours = config.businessHours?.enabled && config.businessHours.schedule?.length > 0
  const showMap = config.business.hasPhysicalStore && config.business.address

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Map Section - Full width above footer content */}
      {showMap && (
        <div className="container mx-auto px-4 pt-8">
          <LocationMap address={config.business.address} businessName={config.business.name} />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{config.business.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.business.description}</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              {config.business.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{config.business.phone}</span>
                </div>
              )}
              {config.business.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{config.business.email}</span>
                </div>
              )}
              {config.business.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{config.business.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours Column */}
          {showBusinessHours && (
            <div>
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios
              </h3>
              <div className="space-y-1 text-sm">
                {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
                  const daySchedule = config.businessHours?.schedule.find(
                    (s) => s.dayOfWeek === dayOfWeek
                  )
                  const isOpen = daySchedule?.isOpen ?? false
                  const shifts = daySchedule?.shifts ?? []

                  return (
                    <div key={dayOfWeek} className="flex justify-between">
                      <span className={isOpen ? "font-medium" : "text-muted-foreground"}>
                        {DAYS_SHORT[dayOfWeek]}
                      </span>
                      <span className={isOpen ? "" : "text-muted-foreground"}>
                        {isOpen && shifts.length > 0
                          ? shifts.map((s) => `${s.open}-${s.close}`).join(", ")
                          : "Cerrado"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-4 text-lg font-semibold">Síguenos</h3>
            <div className="flex gap-4">
              {config.business.socialMedia.instagram && (
                <a
                  href={config.business.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {config.business.socialMedia.facebook && (
                <a
                  href={config.business.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {config.business.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
