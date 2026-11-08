"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/config/site";

const dayMap: Record<string, string> = { Mon: "Mo", Tue: "Tu", Wed: "We", Thu: "Th", Fri: "Fr", Sat: "Sa", Sun: "Su" };

function bogotaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: dayMap[get("weekday")], minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10) };
}

const toMinutes = (hhmm: string) => parseInt(hhmm.slice(0, 2), 10) * 60 + parseInt(hhmm.slice(3), 10);

/** "open|4:00 p. m." o "closed". Es un string para que React compare por valor. */
function getSnapshot(): string {
  const { day, minutes } = bogotaNow();
  const today = site.hours.find((h) => h.opens && h.schemaDays.includes(day));
  if (today?.opens && today.closes && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) {
    return `open|${today.time.split("–")[1].trim()}`;
  }
  return "closed";
}

function subscribe(cb: () => void): () => void {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
}

/** Estado "abierto ahora" según el horario de Bogotá; se calcula solo en el cliente. */
export function OpenNow() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, () => "");
  if (!snap) return <span className="inline-block h-6" aria-hidden="true" />;

  const open = snap.startsWith("open|");
  const text = open
    ? `Abierto ahora · cerramos a las ${snap.slice(5)}`
    : "Cerrado ahora · abrimos de lunes a sábado a las 6:30 a. m.";
  return (
    <p className="inline-flex items-center gap-2 text-sm font-bold" role="status">
      <span className={`size-2.5 rounded-full ${open ? "bg-[#1f9d55]" : "bg-red"}`} aria-hidden="true" />
      {text}
    </p>
  );
}
