const steps = [
  {
    title: "Elige tus insumos",
    text: "Busca por nombre o entra a un departamento y agrega las cantidades que necesitas.",
  },
  {
    title: "Revisa tu pedido",
    text: "Ajusta cantidades, mira el total estimado y dinos si recoges o prefieres domicilio.",
  },
  {
    title: "Envíalo por WhatsApp",
    text: "El pedido llega ya ordenado. Te confirmamos precios y disponibilidad y coordinamos el pago.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="como-pedir" className="mt-14 bg-brown text-on-brown md:mt-28">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <h2 id="como-pedir" className="max-w-xl font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
          Pedir toma tres pasos
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-7 md:mt-10 md:grid-cols-3 md:gap-10">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="tabular font-display text-5xl font-extrabold leading-none text-brand sm:text-6xl" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold sm:mt-3 sm:text-2xl">{s.title}</h3>
              <p className="mt-1.5 max-w-xs leading-relaxed opacity-90 sm:mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
