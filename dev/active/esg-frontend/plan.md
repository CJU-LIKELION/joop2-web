# Implementation Plan — Community ESG Frontend

> This document covers **what to build** (the plan). For **how to work** (rules), see `CLAUDE.md` / `AGENT.md`.
> Frontend only · no backend/DB/endpoints · mock-driven.

## Tech stack
Vite + React + TS / react-router-dom / Tailwind CSS / Kakao Maps SDK / zustand (global state)

## Core concept — the map is the base
The map is the shared canvas. Role determines what overlays on top of it. Mileage/gifticon is the only screen that leaves the map.

```
<MapBase>                       ← shared map (renders report markers + clustering)
   ├─ Citizen mode:  <ReportOverlay />    (report button → pick location on map → report form)
   └─ Dept mode:     <DashboardPanel />   (filters / status change / stats side panel)

<MileagePage>                   ← separate page (no map)
```

## App flow — report → marker → clustering (key requirement)
1. **Citizen reports.** Press "report", then **click a point on the map** to set the location → that click gives `lat`/`lng`. Fill the form (title/category/photo) → the report is saved to the mock store with those coordinates. (No DB — coordinates live in the mock/zustand store.)
2. **A marker/card appears** at that `lat`/`lng`. Multiple reports at/near the same spot accumulate as a count.
3. **Zoom out → cluster.** Nearby markers merge into a single blob showing the count (e.g. 5 reports in a small area → one cluster labeled "5"). **Zoom in → the cluster splits back** into individual markers. Handled by Kakao's built-in **`MarkerClusterer`** (count auto-updates per zoom level).

```
[zoomed out]            [zoomed in]
     (5)        →         • • •
  one cluster             • •      ← 5 individual markers
```

Coordinate input method: **click the map to drop the location** (chosen over geolocation/address-search for demo simplicity).

## Routes (3)
| Path | Role | Screen | Overlay on the map |
|------|------|--------|--------------------|
| `/` | Citizen | Map (base) | report button/form + "go to mileage" button |
| `/dashboard` | Department | Map (base) | dashboard panel (filters · status change · stats) |
| `/mileage` | Citizen | Separate page | (no map) mileage balance + gifticon list/purchase |

- `/` and `/dashboard` **reuse the same `MapBase` component**; only the overlay differs.
- Role switch: a **citizen/department toggle in the header** navigates `/` ↔ `/dashboard` (demo-simple, no login).

## Directory (planned)
```
src/
  pages/
    CitizenMap.tsx      # "/"          map base + report overlay
    DeptDashboard.tsx   # "/dashboard" map base + dashboard panel
    Mileage.tsx         # "/mileage"   separate page
  components/
    layout/             # AppLayout (header w/ role toggle), nav
    map/                # MapBase, MarkerLayer, ClusterLayer (Kakao MarkerClusterer)
    report/             # ReportOverlay, ReportForm
    dashboard/          # DashboardPanel, FilterBar, StatCards
    mileage/            # MileageBalance, GifticonCard, GifticonList
    ui/                 # Button, Card, Modal/Sheet, Badge
  store/                # zustand: reportsStore, mileageStore
  mocks/                # reports.ts, gifticons.ts
  lib/                  # kakaoMap loader
  types/                # Report, Gifticon, ReportStatus, ReportCategory
```

## Data model (types)
- `Report`: id, title, description, category, status, lat, lng, photoUrl?, createdAt
- `ReportCategory`: e.g. litter | damage | recycling | other
- `ReportStatus`: received | in_progress | done
- `Gifticon`: id, name, brand, cost(mileage), imageUrl

## Mock data strategy
- Static seed data + mutation helpers under `src/mocks/`.
- In-memory state via zustand (reset on refresh is acceptable):
  - `reportsStore`: list + `addReport` + `updateStatus`
  - `mileageStore`: balance + `earn` + `spend`

## Map (Kakao)
- `VITE_KAKAO_MAP_KEY` env var (see `.env.example`). If missing, render a gray placeholder with a notice (graceful fallback).
- Load the SDK with the `clusterer` library enabled (`...&libraries=clusterer`).
- **Clustering** via Kakao `MarkerClusterer`: wrap all report markers; it auto-merges nearby markers into a counted cluster on zoom-out and splits them on zoom-in. Tune `minLevel` / `gridSize` for how aggressively it groups.
- `/` map: read + add-report interaction (click map to drop the report location).
- `/dashboard` map: same markers + clustering + filter/click interactions and status changes.

## Build order (each step → verify)
1. Scaffold: Vite + TS + Tailwind + react-router + zustand → verify: `npm run dev` shows a blank page
2. AppLayout (header + role toggle) + 3 routes wired → verify: navigate `/` ↔ `/dashboard` ↔ `/mileage`
3. types + mocks + stores → verify: seed reports/gifticons load into stores
4. MapBase + MarkerLayer + clustering (Kakao loader w/ fallback, MarkerClusterer) → verify: seed reports show as markers on `/`, and zoom-out merges nearby ones into a counted cluster / zoom-in splits them
5. Citizen ReportOverlay + ReportForm (click map to set lat/lng) → verify: submitting drops a marker at the clicked point and earns mileage
6. Mileage page (balance + gifticon list/purchase) → verify: purchasing deducts balance
7. Dept DashboardPanel (FilterBar + StatCards + status change) → verify: filters narrow markers, status change updates a report

## Open questions / assumptions
- Kakao Map API key: proceed with placeholder fallback if not available.
- Role toggle chosen over login/entry-select for demo simplicity — revisit if real auth is needed later.
