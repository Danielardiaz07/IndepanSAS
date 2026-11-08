"use client";

import { MessageCircle } from "lucide-react";
import { contactUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

/** Botón flotante de contacto directo (RF-05). En móvil el contacto vive en la barra inferior. */
export function WhatsAppFab() {
  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("contact_whatsapp", { source: "fab" })}
      className="fixed bottom-6 right-6 z-30 hidden size-14 place-items-center md:grid rounded-full bg-wa text-[#0b2e17] shadow-card transition-transform hover:scale-105 active:scale-95"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
