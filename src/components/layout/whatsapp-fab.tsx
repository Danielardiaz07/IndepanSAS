"use client";

import { MessageCircle } from "lucide-react";
import { contactUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

/** Botón flotante de contacto directo (RF-05). Deja libre el espacio del pie en móvil. */
export function WhatsAppFab() {
  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("contact_whatsapp", { source: "fab" })}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 grid size-14 place-items-center rounded-full bg-wa text-[#0b2e17] shadow-card transition-transform hover:scale-105 active:scale-95"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
