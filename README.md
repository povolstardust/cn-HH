# Cenová nabídka — interaktivní kalkulačka

Vite + React + Tailwind CSS. Vyber moduly vlevo, souhrn vpravo se přepočítá.

## Úprava cen
Vše je v poli `MODULES` na začátku [src/App.jsx](src/App.jsx).
`oneTime: [min, max]` = jednorázový vývoj, `monthly` = paušál / měsíc.

## Vývoj
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy na Vercel
```bash
npm i -g vercel
vercel        # náhled
vercel --prod # produkce
```
Nebo: import repozitáře na vercel.com (framework preset **Vite**, žádné nastavení navíc).
