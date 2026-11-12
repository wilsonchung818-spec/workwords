# WorkWords

Standalone mobile-first business English dictionary PWA in its own GitHub repository and Pages site. It has a separate service worker scope and local storage from BA Speak.

Dictionary entries use a learner-dictionary layout with UK/US pronunciation, parts of speech, numbered meanings with examples, related words, and common phrases. The layout takes cues from familiar learner dictionaries; definitions are fetched from DictionaryAPI.dev and are not copied from Cambridge Dictionary.

## Features

- Spelling suggestions while typing, with keyboard selection
- Plain-English meaning first, all available parts of speech and meanings, and word audio
- Up to three example sentences, using dictionary examples when available and short business-context examples as fallback
- Curated common preposition and phrase combinations for frequently used BA, PM, and Scrum vocabulary
- Save a personal wordbook on the device; saved words remain available offline
- Export all saved word details as agent-readable Markdown or print/save as an A4 PDF
- Android install prompt and installable PWA app shell
- Ebbinghaus-style review intervals: 1, 2, 4, 7, 15, and 30 days; mark words as remembered or hard, or schedule a saved word for today

## Data and privacy

Personal words and review dates are stored in `localStorage`; they are not uploaded. Online lookup and spelling suggestions use free dictionary endpoints. Chinese definitions are requested from MyMemory only when the user selects Chinese. Word audio uses an English female voice available on the device when present; otherwise it plays the dictionary audio or the device's English voice. No account or API key is needed. Collocations come from a small local curated list in `app.js`; other words indicate when no curated phrase entry is available instead of inventing one.

## Run locally

Serve the repository root with any HTTP server and open `/dictionary/`. Service workers and PWA installation do not work from `file://` URLs.

On Android Chrome, open `https://wilsonchung818-spec.github.io/workwords/` and choose **Install app** (or use Chrome's **Install app / Add to Home screen** menu). The page is served over HTTPS.
