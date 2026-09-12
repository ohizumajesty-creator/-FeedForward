# FeedForward release cleanup

No secret files were opened or edited during this cleanup. `.openai/hosting.json` was already absent; its stale import was removed. Application analysis, uploads, link handling, UI, and responsive CSS were retained.

## Changed or added files

- `README.md` — Replaced starter documentation with features, stack, npm setup, variable names, limitations, and AI-development disclosure.
- `package.json` — Renamed package to feedforward, replaced Sites command wrappers, added test/typecheck scripts, removed unused direct dependencies and pnpm metadata.
- `package-lock.json` — Regenerated npm dependency graph for the reduced manifest.
- `vite.config.ts` — Removed Sites authentication plugin, hosting-file import, execution profiles, and unused D1/R2 bindings; kept the Cloudflare Worker runtime.
- `cloudflare-env.d.ts` — Removed unused DB/BUCKET types; retained Gemini variable declarations.
- `tsconfig.json` — Removed stale examples exclusion and excluded generated production output.
- `.gitignore` — Added .openai/, protected .dev.var and secret-file variants, ignored TypeScript caches, and consolidated duplicate rules.
- `eslint.config.mjs` — Removed the deleted hook from lint exceptions and starter-specific wording.
- `scripts/runtime-env.mjs` — New small helper to keep Wrangler/Miniflare state local and disable telemetry by default.
- `CLEANUP_REPORT.md` — This complete file-by-file release cleanup record.

## Deleted files

- `app/chatgpt-auth.ts` — Unused ChatGPT sign-in helpers; no app imports.
- `build/sites-vite-plugin.LICENSE` — Sites-only build/auth plugin and its corresponding license; no retained imports.
- `build/sites-vite-plugin.ts` — Sites-only build/auth plugin and its corresponding license; no retained imports.
- `components/ui/accordion.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/alert-dialog.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/alert.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/aspect-ratio.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/attachment.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/avatar.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/breadcrumb.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/bubble.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/button-group.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/calendar.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/card.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/carousel.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/chart.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/checkbox.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/collapsible.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/combobox.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/command.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/context-menu.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/dialog.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/direction.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/drawer.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/dropdown-menu.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/empty.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/field.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/form.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/hover-card.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/input-group.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/input-otp.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/input.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/item.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/kbd.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/label.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/marker.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/menubar.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/message-scroller.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/message.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/native-select.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/navigation-menu.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/pagination.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/popover.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/radio-group.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/resizable.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/scroll-area.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/select.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/separator.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/sheet.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/sidebar.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/skeleton.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/slider.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/sonner.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/spinner.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/switch.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/table.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/textarea.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/toggle-group.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/toggle.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `components/ui/tooltip.tsx` — Unused UI component; not reachable from the four retained components or app imports.
- `db/index.ts` — Unused database or example scaffold; the application uses browser storage.
- `db/schema.ts` — Unused database or example scaffold; the application uses browser storage.
- `drizzle.config.ts` — Unused database or example scaffold; the application uses browser storage.
- `drizzle/meta/_journal.json` — Unused database or example scaffold; the application uses browser storage.
- `examples/d1/app/api/notes/route.ts` — Unused database or example scaffold; the application uses browser storage.
- `examples/d1/db/schema.ts` — Unused database or example scaffold; the application uses browser storage.
- `hooks/use-mobile.ts` — Only referenced by deleted UI components.
- `pnpm-workspace.yaml` — Sites shared-store policy; npm and package-lock.json are now authoritative.
- `public/file.svg` — Unused starter illustration.
- `public/globe.svg` — Unused starter illustration.
- `public/window.svg` — Unused starter illustration.
- `scripts/build-verified.sh` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/execution-profile.mjs` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/install-ci.mjs` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/install-ci.sh` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/install-pnpm.sh` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/pnpm-install.mjs` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/run-framework.mjs` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/sites-env.mjs` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `scripts/sites-env.sh` — Sites installation/profile/runtime wrapper, replaced by npm scripts and runtime-env.mjs.
- `tsconfig.tsbuildinfo` — Generated TypeScript cache; ignored and may be regenerated by typechecking.

## Removed direct dependencies

`@base-ui/react`, `@hookform/resolvers`, `@shadcn/react`, `cmdk`, `date-fns`, `drizzle-orm`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, `zod`, `drizzle-kit`.

Transitive packages needed by retained libraries remain in the lockfile. The installed dependency tree was reconciled with npm.

## Verification

- All 10 Node tests pass.
- TypeScript checking passes.
- Production build passes after dependency pruning.
- Built Worker starts with npm start and serves the homepage with HTTP 200.
- Lint has no errors; the existing local image-preview `<img>` warning remains.

The pre-existing staged deletion of `.openai/hosting.json` was preserved. This cleanup did not stage, commit, or publish files.
