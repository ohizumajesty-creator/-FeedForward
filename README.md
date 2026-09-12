# FeedForward

Turn saved screenshots and public links into useful plans. FeedForward uses Gemini to extract events, recipe shopping lists, and workout routines, then keeps those plans on a personal action board.

## Features

- Upload an image or screenshot (up to 15 MB).
- Paste public TikTok, Instagram, and other HTTPS links. TikTok uses its official oEmbed endpoint; other pages use public page metadata.
- Review extracted details, missing information, and confidence estimates.
- Check off steps, complete plans, filter the board, and export dated events to a calendar file.
- Clear a capture or cancel its in-flight request.
- Responsive layouts for desktop and mobile.
- Sample events, recipes, and workouts to explore without an API key.

Saved plans use this browser’s local storage; there are no accounts or cross-device sync. Images are sent to Gemini for analysis. Link analysis sends extracted text to Gemini, not the video itself. AI results can be incomplete or incorrect—review them before relying on them.

Public posts can still block automated access. When a post is unavailable or private, upload a screenshot instead. Link fetching allows HTTPS only, checks destinations and redirects against private-network addresses, and limits metadata retrieval to eight seconds and 1 MB. Third-party HTML is parsed on the server and never rendered or executed in the interface.

## Technology

- React 19 and TypeScript
- Next.js App Router conventions, running through Vinext and Vite
- Cloudflare Workers runtime and Wrangler local preview
- Gemini API for structured analysis
- Tailwind CSS, Radix UI primitives, and Lucide icons
- Node.js test runner

The Cloudflare runtime is required: the server uses Worker environment bindings and HTMLRewriter. This is not a static-only site.

## Local setup

Use Node.js 22.13 or newer and npm.

```sh
npm ci
```

Create a local `.dev.vars` file in the project root and configure these variable names with your own credentials:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For live analysis | Gemini API credential |
| `GEMINI_MODEL` | No | Model override; defaults to `gemini-2.5-flash` |

Do not commit credentials or environment files. `.dev.vars` and `.env*` are ignored. No database, Sites account, or ChatGPT authentication is required.

```sh
npm run dev
```

Open `http://localhost:5173`. Keep the terminal running; stopping the server makes upload and link requests fail. Internet access is required for live analysis and public metadata retrieval.

## Validation and production preview

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

`npm start` serves the built Worker locally; use the address printed by Wrangler. It does not publish the project. A hosted release needs a compatible Cloudflare Workers deployment and the Gemini variables configured as deployment secrets/settings.

Tests cover URL validation, private-network rejection, redirect handling, response limits, cancellation, TikTok metadata, resolver fallback, and blocked Instagram responses. They use mocked network responses; they do not guarantee that a social platform will allow access to every public post.

## Development transparency

AI-assisted development tools were used to help build and refine FeedForward. Gemini powers the app’s content analysis. The application code, interface, and extracted results should still be reviewed and tested by people.
