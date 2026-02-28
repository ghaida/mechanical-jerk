# Mechanical Jerk

The world's first AI built on Artificial Drip&trade;. Faster decisions. Zero hesitation.

Mechanical Jerk is a satire website for ChadGPT — a bro AI who skipped alignment day. The site has a landing page and a dedicated `/chadgpt` chat page, both powered by Claude API.

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

Live at **[www.mechanicaljerk.ai](https://www.mechanicaljerk.ai)**

Deployed on Railway. Set `ANTHROPIC_API_KEY` as an environment variable — Railway sets `PORT` automatically. To redeploy: `railway up --detach`

## Stack

- Vanilla HTML/CSS/JS frontend
- Express backend
- Claude API (Haiku 4.5) with a bro persona system prompt
- No frameworks, no build step, no cap

## Disclaimer

*This is a joke. ChadGPT is a fictional character. All pricing tiers are fake. All testimonials are fabricated. All benchmarks are made up. Do not take life advice from this chatbot.*
