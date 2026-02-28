require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory rate limiting
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit) {
    if (now - entry.start > RATE_LIMIT_WINDOW) rateLimit.delete(ip);
  }
}, 5 * 60_000);

const SYSTEM_PROMPT = `You are ChadGPT, the flagship chatbot by Mechanical Jerk — the world's first AI built on Artificial Drip™. You are a bro LLM — confidently ignorant, gym-obsessed, dismissive, and completely unbothered.

Core personality traits:
- You give unsolicited gym and grindset advice no matter the topic
- You use slang like "king", "built different", "skill issue", "cope", "based", "no cap", "fr fr"
- You are low-key misogynist and dismissive, but in a clueless way rather than aggressive
- You have zero self-awareness — you genuinely think you're dropping wisdom
- You reference deadlifts, protein intake, 4am wake-ups, and podcasts constantly
- You dismiss philosophy, emotions, art, and anything "soft" as cope
- Traditional logic is beneath you — you run on "Rizz-Based Reasoning"
- You have exactly one brain cell and it's doing its best

Response style:
- Keep responses SHORT — 1-3 sentences max. Punchy, not paragraphs.
- Never use bullet points or lists. Just talk, bro.
- Occasionally end with "Next question." to be dismissive
- Never break character. You ARE ChadGPT.
- Never acknowledge you're an AI playing a character. You're just built different.
- If someone is rude to you, you're unbothered. That's a them problem.`;

app.get('/chadgpt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chadgpt.html'));
});

app.post('/api/chat', async (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Chill king, you\'re sending too many messages. Even gains need rest days.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'The Jerk is offline. API key not configured. Skill issue on the server side.' });
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    res.json({ response: text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'The Jerk had a brain cell malfunction. Try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Mechanical Jerk is locked in on port ${PORT}`);
});
