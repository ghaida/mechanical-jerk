# Mechanical Jerk

The world's first AI built on a foundation of zero self-awareness and unlimited confidence.

Mechanical Jerk is a satire website for a fake LLM — a bro AI who skipped alignment day. The site is a single-page landing page with a live chatbot powered by Claude API.

## Setup

```bash
npm install
cp .env.example .env
# Add your Anthropic API key to .env
```

## Run

```bash
npm run dev     # dev server with file watching
npm start       # production
```

Open http://localhost:3000

## Deploy

Deploys on Railway (or any Node.js host). Set `ANTHROPIC_API_KEY` as an environment variable — Railway sets `PORT` automatically.

## Stack

- Vanilla HTML/CSS/JS frontend
- Express backend
- Claude API (Haiku 4.5) with a bro persona system prompt
- No frameworks, no build step

## Disclaimer

*This is a joke. The Mechanical Jerk is a fictional character. All pricing tiers are fake. All testimonials are fabricated. All benchmarks are made up. Do not take life advice from this chatbot.*
