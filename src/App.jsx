import { useMemo, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   PRICING DATA — uprav text a čísla zde před schůzkou.
   Každý modul: oneTime = [min, max] (jednorázový vývoj), monthly = paušál / měsíc.
   Pokud je cena fixní, zadej [hodnota, hodnota] (např. [10000, 10000]).
──────────────────────────────────────────────────────────────────────────── */
const CURRENCY = "Kč";

const BRAND = {
  name: "povol.online",
  eyebrow: "Návrh spolupráce",
  title: "Sestavme řešení na míru",
  subtitle:
    "Vyberte moduly, které vás zajímají. Cenová nabídka se přepočítá v reálném čase.",
};

const MODULES = [
  {
    id: "reservation",
    title: "Pouze rezervační / předplatitelský systém",
    description: "Integrace do stávajícího webu.",
    oneTime: [25000, 40000],
    monthly: 1500,
  },
  {
    id: "migration",
    title: "Migrace z Wix na vlastní řešení",
    description: "Next.js / Supabase, zrušení Wixu.",
    oneTime: [15000, 25000],
    monthly: 600,
  },
  {
    id: "redesign",
    title: "Kompletní UX/UI Redesign webu",
    description: "Moderní, čistý design přizpůsobený značce.",
    oneTime: [15000, 25000],
    monthly: 0,
  },
  {
    id: "stripe",
    title: "Implementace platební brány Stripe v CZK",
    description: "Online platby kartou přímo na webu.",
    oneTime: [10000, 10000],
    monthly: 0,
  },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const nf = new Intl.NumberFormat("cs-CZ");

function formatMoney(value) {
  return `${nf.format(value)} ${CURRENCY}`;
}

// Zobrazí rozsah, nebo jedno číslo když min === max.
function formatRange([min, max]) {
  if (min === max) return formatMoney(min);
  return `${nf.format(min)} – ${nf.format(max)} ${CURRENCY}`;
}

function CheckIcon({ active }) {
  return (
    <span
      className={[
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
        active
          ? "border-clay-500 bg-clay-500 text-cream"
          : "border-clay-200 bg-white/60 text-transparent group-hover:border-clay-400",
      ].join(" ")}
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
        <path
          d="M4 10.5l4 4 8-9"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function App() {
  const [selected, setSelected] = useState(() => new Set());

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const totals = useMemo(() => {
    const chosen = MODULES.filter((m) => selected.has(m.id));
    return {
      chosen,
      oneTimeMin: chosen.reduce((s, m) => s + m.oneTime[0], 0),
      oneTimeMax: chosen.reduce((s, m) => s + m.oneTime[1], 0),
      monthly: chosen.reduce((s, m) => s + m.monthly, 0),
    };
  }, [selected]);

  const hasSelection = totals.chosen.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden text-ink">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cream" />
        <div className="absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-clay-200/40 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-clay-100/60 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="povol.online"
            className="h-7 w-auto"
            width="62"
            height="28"
          />
          <span className="text-sm font-medium tracking-tight text-ink">
            {BRAND.name}
          </span>
        </div>
        <span className="rounded-full border border-clay-200 bg-white/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-clay-600 backdrop-blur">
          Cenová nabídka
        </span>
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay-500">
          {BRAND.eyebrow}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
          {BRAND.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/55">
          {BRAND.subtitle}
        </p>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Left: modules */}
          <section>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">
              Moduly
            </h2>
            <div className="space-y-4">
              {MODULES.map((m, i) => {
                const active = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={active}
                    className={[
                      "group relative w-full overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 ease-out",
                      active
                        ? "border-clay-400 bg-white shadow-[0_18px_40px_-24px_rgba(112,76,57,0.45)] -translate-y-0.5"
                        : "border-clay-100 bg-white/55 backdrop-blur-sm hover:-translate-y-0.5 hover:border-clay-200 hover:bg-white/80 hover:shadow-[0_18px_40px_-28px_rgba(112,76,57,0.35)]",
                    ].join(" ")}
                  >
                    {/* Accent rail */}
                    <span
                      className={[
                        "absolute inset-y-0 left-0 w-1 origin-top transition-transform duration-300",
                        active ? "scale-y-100 bg-clay-500" : "scale-y-0 bg-clay-400",
                      ].join(" ")}
                    />

                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">
                        <CheckIcon active={active} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display text-xs text-clay-400">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <h3 className="font-display text-lg font-medium leading-snug text-ink">
                                {m.title}
                              </h3>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-ink/50">
                              {m.description}
                            </p>
                          </div>

                          <div className="shrink-0 text-left sm:text-right">
                            <div className="font-display text-base font-medium text-ink">
                              {m.oneTime[1] === 0
                                ? "Bez vývoje"
                                : formatRange(m.oneTime)}
                            </div>
                            <div className="mt-1 text-xs text-ink/40">
                              {m.monthly === 0
                                ? "bez paušálu"
                                : `+ ${formatMoney(m.monthly)} / měs.`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: sticky summary */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-clay-100 bg-white/80 shadow-[0_30px_70px_-40px_rgba(112,76,57,0.5)] backdrop-blur-md">
              <div className="px-7 pt-7">
                <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                  Souhrn objednávky
                </h2>
                <p className="mt-1 text-xs text-ink/40">
                  Sestaveno na míru pro vaši značku
                </p>
              </div>

              {/* Line items */}
              <div className="px-7 pt-6">
                <div className="min-h-[64px]">
                  {hasSelection ? (
                    <ul className="space-y-3.5">
                      {totals.chosen.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <span className="text-ink/60">{m.title}</span>
                          <span className="shrink-0 whitespace-nowrap font-medium text-ink">
                            {m.oneTime[1] === 0 ? "—" : formatRange(m.oneTime)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed text-ink/40">
                      Zatím nevybrán žádný modul. Vyberte položky vlevo a nabídka
                      se sestaví automaticky.
                    </p>
                  )}
                </div>

                <div className="my-6 border-t border-dashed border-clay-200" />

                {/* One-time total */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay-500">
                    Celková cena za vývoj
                  </div>
                  <div className="mt-1.5 font-display text-3xl font-medium tracking-tight text-ink">
                    {totals.oneTimeMin === totals.oneTimeMax
                      ? formatMoney(totals.oneTimeMin)
                      : `${nf.format(totals.oneTimeMin)} – ${nf.format(
                          totals.oneTimeMax,
                        )} ${CURRENCY}`}
                  </div>
                  <div className="mt-1 text-xs text-ink/40">Jednorázově</div>
                </div>
              </div>

              {/* Monthly — premium block */}
              <div className="mt-6 bg-ink px-7 py-6 text-cream">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay-200">
                  Měsíční poplatky
                </div>
                <div className="mt-1.5 font-display text-3xl font-medium tracking-tight">
                  {formatMoney(totals.monthly)}
                </div>
                <div className="mt-1 text-xs text-clay-200/80">
                  Paušál za správu, hosting a licence
                </div>
              </div>

              <p className="px-7 py-5 text-[11px] leading-relaxed text-ink/35">
                Uvedené ceny jsou orientační a nezávazné. Finální cena bude
                potvrzena v nabídce po upřesnění rozsahu. Ceny bez DPH.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10">
        <div className="border-t border-clay-100 pt-6 text-xs text-ink/40">
          © {new Date().getFullYear()} {BRAND.name} — vytvořeno pro vaši
          prezentaci.
        </div>
      </footer>
    </div>
  );
}
