# Adrine Hospital Module Demo
Adrine is a B2B enterprise-grade hospital management SaaS platform for multi-specialty hospitals.

## Technologies Used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Development
```sh
npm install
npm run dev
```

## Added Demo Coverage
- Unified `Nursing Task Board` with bedside monitoring, pending tasks, MAR reminders, and discharge handoff.
- Expanded `MRD` for IPD digital file workflow, stationery template matrix, scanned attachment register, and archive controls.
- Dynamic `MIS Reports` with live store-backed datasets and CSV/JSON exports.
- New `Pharmacy Reports` screen for dispensing workflow, stock/batch governance, narcotics register, validation alerts, and billing linkage.
- Tenant-level `Form Builder` in Admin Settings to customize core admission and clinical form templates.

## Deployment Placeholders (Docker + PostgreSQL)
```sh
docker compose up --build
```

Optional backend placeholders:
```sh
docker compose --profile backend-stub up --build
```

The compose stack includes:
- Frontend container (`web`)
- PostgreSQL container (`postgres`)
- NestJS placeholder service (`backend-nest-stub`)
- FastAPI placeholder service (`backend-fastapi-stub`)

## Backend Integration Stub
`src/lib/apiClient.ts` contains frontend-safe integration stubs for future NestJS/FastAPI wiring.
Set `VITE_API_BASE_URL` and optionally `VITE_API_PROVIDER` (`nest` or `fastapi`) when backend endpoints are available.
