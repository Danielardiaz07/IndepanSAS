import Image from "next/image";
import { DepartmentIcon } from "@/components/ui/icons";

const tones = ["bg-sun", "bg-kraft", "bg-blush", "bg-sunken"] as const;

function toneFor(slug: string): string {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return tones[h % tones.length];
}

interface Props {
  src: string | null;
  alt: string;
  department: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Foto del producto o, mientras no exista, una pieza provisional con el ícono del departamento. */
export function ProductImage({ src, alt, department, sizes, priority, className = "" }: Props) {
  if (src) {
    return (
      <div className={`relative aspect-[4/3] overflow-hidden bg-sunken ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`relative grid aspect-[4/3] place-items-center overflow-hidden ${toneFor(department)} ${className}`}
      role="img"
      aria-label={`Imagen de ${alt} pendiente`}
    >
      <DepartmentIcon slug={department} className="size-1/4 text-ink/40" strokeWidth={1.5} />
    </div>
  );
}
