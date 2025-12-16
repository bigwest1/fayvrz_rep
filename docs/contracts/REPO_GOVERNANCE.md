# Repo Governance

## Folder Structure and Naming
- `src/app/(marketing)` for public pages; `src/app/(app)` for authenticated app; `src/app/api` for route handlers.
- `src/components/` for shared UI; subfolders per domain: `layout/`, `marketing/`, `life-events/`.
- `src/lib/` for utilities; `src/content/` for structured content; `src/styles/` for global styles/tokens.
- Use kebab-case for folders, PascalCase for React components, camelCase for helpers.

## Server-First Rules
- Prefer Server Components; fetch and process data on the server.
- Only opt into Client Components when stateful UI or browser APIs are required; keep surface small.

## Client Component Rules
- Mark with `"use client"` only when needed; isolate client logic in leaf components.
- Avoid client-only data fetching when server routes suffice; pass serialized props.

## Animation Rules
- Animations must be purposeful, subtle, and disabled/respected via `prefers-reduced-motion`.
- No gradients or neon palettes; rely on typography, spacing, and borders.

## Commit Conventions
- Small, focused commits with clear messages.
- Never commit secrets; `.env.example` only. Retain existing git remote configuration.
