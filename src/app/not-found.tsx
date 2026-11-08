import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center gap-4 px-4 py-28 text-center">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">No encontramos esa página</h1>
      <p className="text-lg text-muted">El producto o la sección que buscas ya no está disponible.</p>
      <Link href="/productos" className="mt-2 flex min-h-12 py-2 items-center rounded-full bg-btn px-6 font-bold text-on-btn">
        Ver el catálogo
      </Link>
    </div>
  );
}
