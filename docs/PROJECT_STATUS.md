# Greenhouse Management System — project status

## Current architecture

- Expo SDK **58** (`expo ~58.0.19`), React Native **0.88**, React **19.3**, Expo Router **~58.0.26**.
- Routes live in `src/app`. Root layout keeps Native Tabs.
- Domain types and agricultural rules live in `src/domain` (no React Native UI imports).
- Sample farm data lives in `src/data/demo-farm.ts`. It is bundled in memory, not persisted.

## Completed

### Milestone 1 — Foundation

- Farm, Greenhouse, Zone, CropSpecies, Cultivar, CropCycle, stage history, sample readings, tasks, and harvest types.
- Demo farm: Riverside Demo Farm, two greenhouses, four zones, three crop cycles.
- Dashboard on `/` answering current conditions, attention items, tasks, crop stages, and latest harvest.
- Greenhouse list and detail routes.
- Crop catalogue plus the original vegetable growing guides.

### Milestone 2 — Greenhouse Management

- Zone detail screen showing zone-specific conditions and active cycles.
- Greenhouse edit screen for basic configuration (demo mode).
- Enhanced navigation between greenhouses and zones.

### Milestone 3 — Crop Management

- Crop cycle list and detailed history.
- "Start new crop cycle" workflow (demo mode).
- Growth stage tracking and transition recording UI.

### Milestone 4 — Daily Farm Operations

- Task management system with pending and completed lists.
- Task detail view and completion status recording (demo mode).

### Milestone 5 — Monitoring

- Monitoring overview grid for all greenhouses.
- Manual measurement recording workflow (demo mode).
- Stale data indicators and multi-metric support.

### Milestone 6 — Harvest

- Harvest history tracking.
- Recording marketable vs. rejected produce and estimates (demo mode).

### Milestone 7 — Persistence (Foundation)

- `expo-sqlite` installed and configured.
- Database schema established with tables for all core entities.
- Seeding logic to populate SQLite from demo data on first launch.

### Milestone 9 — Decision Support (Foundation)

- Agronomic rule engine implemented in `src/domain/recommendations`.
- Dynamic attention items generated from sensor data (e.g., high temperature, stale data).

### UI & Animations (Enhancement)

- Reusable `FadeInView` component using `react-native-reanimated`.
- Staggered entry animations for cards and list items on Dashboard, Greenhouse List, Greenhouse Detail, Task List, and Monitoring screens.
- Subtle fade-in animations for all screen transitions in `FarmScreen`.
- Smooth layout animations for dynamic list updates.

## Important commands

```powershell
cd F:\workspace\myfirstapp
npx expo start
npx tsc --noEmit
npx eslint src
```

## Known limitations

- Data entry (tasks, harvests, measurements) is currently in "Demo Mode" (Alert only) as the full repository-to-SQLite wiring for every feature is a future integration step.
- Backend synchronization and authentication (Milestone 8) are not implemented.
- Unit conversion (metric/imperial) logic exists in types but is not fully togglable in UI.

## Next steps

- Implement Milestone 8 (Backend integration) when a server is available.
- Wire all "Demo Mode" forms to the SQLite database via repository implementations.
- Add advanced charting for environmental trends (Milestone 10).
