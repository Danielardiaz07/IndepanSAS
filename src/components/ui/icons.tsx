import type { SVGProps } from "react";
import {
  Beaker,
  CakeSlice,
  Cherry,
  ChefHat,
  Milk,
  Package,
  Palette,
  Shapes,
  Wheat,
  Wine,
  Candy,
  type LucideIcon,
} from "lucide-react";

/** Redes sociales: lucide ya no incluye logotipos de marca, se dibujan aquí con el mismo trazo. */
function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </Svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v7h4v-7h3l1-4h-4V7.5A.5.5 0 0 1 12.5 7H15z" />
    </Svg>
  );
}

/** Ícono por departamento, usado en tarjetas y en las imágenes provisionales. */
export const departmentIcons: Record<string, LucideIcon> = {
  "harinas-premezclas": Wheat,
  "levaduras-mejoradores": Beaker,
  "azucar-sal-condimentos": Candy,
  "grasas-lacteos": Milk,
  "rellenos-coberturas": CakeSlice,
  "frutas-frutos-secos": Cherry,
  "esencias-colores-decoracion": Palette,
  "moldes-capacillos": Shapes,
  "reposteria-utensilios": ChefHat,
  "empaques-desechables": Package,
  "vinos-licores": Wine,
};

export function DepartmentIcon({ slug, ...props }: { slug: string } & React.ComponentProps<LucideIcon>) {
  const Icon = departmentIcons[slug] ?? Package;
  return <Icon aria-hidden="true" {...props} />;
}
