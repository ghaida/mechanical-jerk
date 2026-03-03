# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mechanical Jerk — a joke/satire website for a fake LLM called "ChadGPT" by "Mechanical Jerk" (a play on Mechanical Turk). The character is a bro LLM who is low-key misogynist, ignorant, and completely unbothered. The site has a landing page and a dedicated `/chadgpt` chat page.

## Design Direction

Sleek startup polish with bro energy underneath. Evolved from Moodboard C (Bro Aesthetic Extreme) and Moodboard A (Sleek Parody). All moodboards preserved in `_design/` for reference.

- **Fonts**: Space Grotesk (headings), Oswald (labels/UI), Inter (body)
- **Palette (desaturated)**: Fire #c0401e, Lava #a85a2a, Gold #b8922e, Green #2eb86a, BG #08080a, Surface #121215, Border #242429
- **Aesthetic**: Clean rounded corners, subtle animated gradient hero bg, no harsh patterns or clip-paths. Warmth from the fire palette, restraint from the sleek layout.
- **Chat UI**: Rounded bot messages with left fire border, "Based"/"Cope" reaction buttons, green status dot
- **Tone**: Looks like a legit startup at first glance — the copy does the comedy
- **Spelling**: Always "ChadGPT" — never "CHADGPT", "Chadgpt", "ChadGpt", etc. Lowercase `chadgpt` is fine for URLs/filenames only.
- **Symbols**: Use HTML entities (&amp;trade; &amp;copy; &#-codes) not raw unicode in HTML

## Tech Stack

- Semantic HTML5, mobile-first responsive CSS
- Node.js backend (serves static files + chat API endpoint)
- Claude API (Haiku 4.5 — `claude-haiku-4-5-20251001`) powers the chatbot — ALWAYS use Haiku, the cheapest model
- dotenv for loading .env
- Deployed on Railway

## Architecture

- `server.js` — Express app, serves `public/` static files + `POST /api/chat` endpoint
- `public/style.css` — the one true stylesheet (graduated from hybrid experiments)
- `public/chat.js` — chat UI logic, conversation history, typing indicator, reaction buttons
- `public/index.html` — landing page: hero (ChadGPT typewriter), stats, ticker, features, testimonials (3 cards), pricing (4 tiers in Dogecoin), enterprise Brofessional section, live chat, final CTA, footer
- `public/chadgpt.html` — dedicated chat page at `/chadgpt` with nav, chatbot, full-width upgrade callout, footer
- `public/og.png` — OG/social preview image for homepage (1200x630, Space Grotesk + Oswald embedded)
- `public/og-chat.png` — OG/social preview image for chat page
- Nav has hamburger menu on mobile (JS toggle in inline scripts on both pages), links shown inline on desktop
- Backend proxies chat to Claude API with bro persona system prompt + per-request topic steer, in-memory rate limiting (20 req/min per IP)
- Frontend is vanilla HTML/CSS/JS — no framework
- CSS is mobile-first with `@media (min-width: 601px)` for tablet, `@media (min-width: 900px)` for desktop nav
- 8px spacing system (`--space-1` through `--space-11`) and radius tokens
- Non-streaming responses (v1 simplicity)
- Old moodboard stylesheets preserved in `_design/` for reference
- `_design/og-home.svg` — SVG source for OG images (fonts embedded as base64 woff)
- `_design/og-preview.html` — local preview page showing OG images in iMessage/Slack/Twitter mockups
- OG images rebuilt via: `rsvg-convert -w 1200 -h 630 _design/og-home.svg -o public/og.png`
- Pricing is displayed in Dogecoin (&ETH;) across all tiers including enterprise

## ChadGPT Persona — The Gym Problem

The ChadGPT system prompt is designed for a multi-dimensional bro: crypto trader, hustle influencer, biohacker, dating strategist, podcast brain, car guy — who also works out. In practice, ALL Claude models (Haiku, Sonnet, Opus) default to gym/lifting/protein advice for every response regardless of topic, because bro slang ("king", "no cap", "built different", "skill issue") is overwhelmingly correlated with gym culture in training data.

**What was tried and failed:**
- Detailed topic-specific instructions in the system prompt
- Direct prohibition ("Do NOT mention gym")
- Few-shot examples as conversation turns showing non-gym responses
- Removing all gym/fitness words from the system prompt entirely
- Reframing the character as "tech startup CEO" instead of "bro"
- Assistant prefill to force non-gym openers
- Short vs long system prompts
- Temperature tuning (0.9)
- Upgrading model (Haiku → Sonnet → Opus) — no meaningful difference

**What helps a little:**
- Per-request random topic steers appended to the system prompt (e.g. "frame this response through CRYPTO") — occasionally pulls in other dimensions
- Multi-turn conversations naturally vary more than cold one-shot prompts
- The rich system prompt gives the model non-gym options even if it doesn't always use them

**Current approach:** Two-axis randomization — each request gets a random TOPIC LENS (15 options: crypto, podcasts, biohacking, dating economics, hustle, cars, sports, startup life, real estate, AI/tech, stoicism, nutrition, watches/fashion, travel, morning routine) combined with a random RESPONSE STYLE (10 options: hot take, fake anecdote, made-up statistic, unsolicited advice, TED talk, wild comparison, "you don't get it" energy, name-dropping, mid-sentence flex, coaching moment). This gives 150 unique combos per request. The system prompt lists comedy techniques rather than rigid topic→response mappings, giving the model more creative latitude. Gym still surfaces but variety is significantly improved.

**Important: ALWAYS use Haiku (`claude-haiku-4-5-20251001`).** Model tier makes zero difference for this persona — Opus is just as gym-brained as Haiku. No reason to spend more.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start dev server with file watching (node --watch)
- `npm start` — start production server
- Server runs on PORT env var or 3000 by default
- `railway up --detach` — deploy to Railway

## Deployment

- Hosted on Railway: https://mechanical-jerk-production.up.railway.app
- Custom domain: www.mechanicaljerk.ai (CNAME → Railway)
- mechanicaljerk.ai (root) redirects to www via Name.com URL forwarding
- `ANTHROPIC_API_KEY` set as Railway env var
- Railway auto-detects Node.js from package.json, runs `npm start`
