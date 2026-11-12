# WorkWords

Standalone mobile-first business English dictionary PWA in its own GitHub repository and Pages site. It has a separate service worker scope and local storage from BA Speak.

## Features

- English definition and part of speech first, with a switch to request Chinese translation
- Up to three example sentences, using dictionary examples when available and short business-context examples as fallback
- Curated common preposition and phrase combinations for frequently used BA, PM, and Scrum vocabulary
- Save a personal wordbook on the device; saved words remain available offline
- Export all saved word details as agent-readable Markdown or print/save as an A4 PDF
- Android install prompt and installable PWA app shell
- Weekly review-day preference saved on the device

## Data and privacy

Personal words are stored in `localStorage`; they are not uploaded. Online lookup uses the free Dictionary API. Chinese definitions are requested from MyMemory only when the user selects Chinese. No account or API key is needed. Collocations come from a small local curated list in `app.js`; other words indicate when no curated phrase entry is available instead of inventing one.

## Run locally

Serve the repository root with any HTTP server and open `/dictionary/`. Service workers and PWA installation do not work from `file://` URLs.

On Android Chrome, open `https://wilsonchung818-spec.github.io/workwords/` and choose **Install app** (or use Chrome's **Install app / Add to Home screen** menu). The page is served over HTTPS.
