"use client"

import { Clock } from "lucide-react"
import type { BusinessHours as BusinessHoursType } from "@/lib/store-config"

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
]

interface BusinessHoursProps {
  businessHours: BusinessHoursType
}

export function BusinessHours({ businessHours }: BusinessHoursProps) {
  if (!businessHours?.enabled || !businessHours.schedule?.length) {
    return null
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours, 10)
    return `${hour}:${minutes}`
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Horarios de Atención</h3>
      </div>
      <div className="space-y-2">
        {DAYS_OF_WEEK.map((day) => {
          const daySchedule = businessHours.schedule.find(
            (s) => s.dayOfWeek === day.value
          )
          const isOpen = daySchedule?.isOpen ?? false
          const shifts = daySchedule?.shifts ?? []

          return (
            <div
              key={day.value}
              className="flex items-start justify-between text-sm"
            >
              <span className={isOpen ? "font-medium" : "text-muted-foreground"}>
                {day.label}
              </span>
              <span className={isOpen ? "" : "text-muted-foreground italic"}>
                {isOpen && shifts.length > 0
                  ? shifts
                      .map((s) => `${formatTime(s.open)} - ${formatTime(s.close)}`)
                      .join(", ")
                  : "Cerrado"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
