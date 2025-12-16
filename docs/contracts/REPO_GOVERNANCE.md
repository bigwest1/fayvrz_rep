# Repo Governance

## Folder Structure & Naming
- `src/app/(marketing)` for public marketing routes; `src/app/(app)` for authenticated app views; `src/app/api` for Route Handlers; shared components in `src/components/**`; utilities in `src/lib`; long-form content in `src/content`; styles in `src/styles`.
- Use kebab-case for routes and folder names; use PascalCase for React components; keep files focused and small.
- README.md lives in new folders to clarify purpose and constraints.

## Server-First Rules
- Default to Server Components for pages/layouts; render data on the server and stream where helpful.
- Keep business logic server-side; prefer Route Handlers or server actions over client-side fetching.
- Avoid exposing secrets to the client; environment references stay on the server.

## Client Component Rules
- Add `"use client"` only when interactive state or browser APIs are needed.
- Keep client bundles small: isolate interactive widgets, avoid lifting heavy logic into the client, and share types via `src/lib`.
- Do not wrap entire pages in client components; compose client pieces into server-rendered shells.

## Animation Rules
- Animations must be purposeful and subtle; disable or minimize when `prefers-reduced-motion` is set.
- Avoid gratuitous motion on page load; favor micro-interactions tied to user intent.
- No gradients or neon color shifts; use opacity and movement sparingly.

## Commit Conventions
- Small, focused commits with imperative, lowercase subjects (e.g., `chore: add layout shell`).
- Include scope prefixes (`feat`, `chore`, `docs`, `fix`, etc.) and keep bodies concise.
- Do not commit secrets; `.env.example` documents required variables.
