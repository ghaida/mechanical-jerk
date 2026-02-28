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
- **Symbols**: Use HTML entities (&amp;trade; &amp;copy; &#-codes) not raw unicode in HTML

## Tech Stack

- Semantic HTML5, mobile-first responsive CSS
- Node.js backend (serves static files + chat API endpoint)
- Claude API (Haiku 4.5 — `claude-haiku-4-5-20251001`) powers the chatbot with a character system prompt
- dotenv for loading .env
- Deployed on Railway

## Architecture

- `server.js` — Express app, serves `public/` static files + `POST /api/chat` endpoint
- `public/style.css` — the one true stylesheet (graduated from hybrid experiments)
- `public/chat.js` — chat UI logic, conversation history, typing indicator, reaction buttons
- `public/index.html` — landing page: hero, stats, ticker, features, testimonials (3 cards), pricing (4 tiers), live chat, final CTA, footer
- `public/chadgpt.html` — dedicated chat page at `/chadgpt` with nav, chatbot, full-width upgrade callout, footer
- Backend proxies chat to Claude API with bro persona system prompt, in-memory rate limiting (20 req/min per IP)
- Frontend is vanilla HTML/CSS/JS — no framework
- CSS uses an 8px spacing system (`--space-1` through `--space-11`) and radius tokens
- Non-streaming responses (v1 simplicity)
- Old moodboard stylesheets preserved in `_design/` for reference

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
