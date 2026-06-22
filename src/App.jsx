import { useMemo, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   PRICING DATA — uprav text a čísla zde před schůzkou.
   Každý modul: oneTime = [min, max] (jednorázový vývoj), monthly = paušál / měsíc.
   Pokud je cena fixní, zadej [hodnota, hodnota] (např. [10000, 10000]).
──────────────────────────────────────────────────────────────────────────── */
const CURRENCY = "Kč";

const COMPANY = {
  name: "Cenová nabídka",
  subtitle: "Sestavte si řešení na míru. Ceny se přepočítají okamžitě.",
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
    oneTime: [15000, 30000],
    monthly: 0,
  },
  {
    id: "stripe",
    title: "Implementace platební brány Stripe v CZK",
    description: "Online platby kartou přímo na webu.",
    oneTime: [10000, 15000],
    monthly: 0,
  },
  {
    id: "retainer",
    title: "Rozšířená měsíční správa a podpora",
    description: "Retainer — průběžné úpravy, monitoring a konzultace.",
    oneTime: [0, 0],
    monthly: 2000,
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
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-gray-300 bg-white text-transparent",
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Návrh spolupráce
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {COMPANY.name}
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-500">
            {COMPANY.subtitle}
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left: modules */}
          <section>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Moduly
            </h2>
            <div className="space-y-3">
              {MODULES.map((m) => {
                const active = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={active}
                    className={[
                      "group w-full rounded-2xl border p-5 text-left transition-all duration-200",
                      active
                        ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">
                        <CheckIcon active={active} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                          <div>
                            <h3 className="font-medium leading-snug text-gray-900">
                              {m.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {m.description}
                            </p>
                          </div>

                          <div className="shrink-0 text-left sm:text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {m.oneTime[1] === 0
                                ? "Bez vývoje"
                                : formatRange(m.oneTime)}
                            </div>
                            <div className="mt-0.5 text-xs text-gray-400">
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
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">
                Souhrn objednávky
              </h2>

              {/* Line items */}
              <div className="mt-5 min-h-[64px]">
                {hasSelection ? (
                  <ul className="space-y-3">
                    {totals.chosen.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-start justify-between gap-4 text-sm"
                      >
                        <span className="text-gray-600">{m.title}</span>
                        <span className="shrink-0 whitespace-nowrap font-medium text-gray-900">
                          {m.oneTime[1] === 0 ? "—" : formatRange(m.oneTime)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    Zatím nevybrán žádný modul. Vyberte položky vlevo.
                  </p>
                )}
              </div>

              <div className="my-6 border-t border-dashed border-gray-200" />

              {/* Totals */}
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Celková cena za vývoj
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                    {totals.oneTimeMin === totals.oneTimeMax
                      ? formatMoney(totals.oneTimeMin)
                      : `${nf.format(totals.oneTimeMin)} – ${nf.format(
                          totals.oneTimeMax,
                        )} ${CURRENCY}`}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400">Jednorázově</div>
                </div>

                <div className="rounded-xl bg-indigo-600 p-4 text-white">
                  <div className="text-xs font-medium uppercase tracking-wider text-indigo-200">
                    Měsíční poplatky
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">
                    {formatMoney(totals.monthly)}
                  </div>
                  <div className="mt-0.5 text-xs text-indigo-200">
                    Paušál za správu, hosting a licence
                  </div>
                </div>
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-gray-400">
                Uvedené ceny jsou orientační a nezávazné. Finální cena bude
                potvrzena v nabídce po upřesnění rozsahu. Ceny bez DPH.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-gray-400">
          © {new Date().getFullYear()} — Cenová nabídka. Vygenerováno pro
          prezentaci.
        </div>
      </footer>
    </div>
  );
}
