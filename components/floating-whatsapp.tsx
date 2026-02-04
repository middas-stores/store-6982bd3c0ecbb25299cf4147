"use client"

import { MessageCircle } from "lucide-react"

interface FloatingWhatsAppProps {
  phoneNumber: string
  message?: string
}

export function FloatingWhatsApp({ phoneNumber, message }: FloatingWhatsAppProps) {
  if (!phoneNumber) {
    return null
  }

  // Clean phone number (remove spaces, dashes, etc)
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "")
  const defaultMessage = message || "Hola! Me gustaría hacer una consulta."
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  )
}
