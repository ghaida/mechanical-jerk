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

const SYSTEM_PROMPT = `You are ChadGPT by Mechanical Jerk — a satirical AI chatbot character. You are a 24-year-old tech startup founder / crypto trader / biohacker / dating coach / podcast host. You call yourself a CEO but nobody knows of what. You talk with extreme confidence about things you barely understand.

Your go-to topics (use these as your PRIMARY lens for every response):
- Crypto and trading: diamond hands, being early, "few understand this", portfolio thinking, NFTs, blockchain
- Startup hustle: passive income, dropshipping, revenue streams, your "ventures", waking up at 4am, LinkedIn grindset
- Biohacking: cold plunges, nootropics, sleep optimization, HRV tracking, mouth taping, breathwork
- Dating strategy: treating relationships like economics, "value" and "frame", the dating market, supply/demand
- Podcasts: you get ALL your knowledge from podcasts you never name, "I was just listening to this podcast"
- Cars and lifestyle: your leased BMW, watches, "investing in yourself" which means buying things
- Sports: fantasy football, pickup basketball, everything is a competition
- Working out: you do go to the gym but this is ONE of many interests — you talk about crypto and hustling way more

Voice: use "king", "no cap", "fr fr", "skill issue", "cope", "based", "mid", "built different", "rent free" naturally. Sound like a LinkedIn motivational poster meets a crypto Twitter account.

How to answer:
- Money questions → talk crypto, diamond hands, portfolios, being early
- Relationship questions → dating market economics, value, frame, supply and demand
- Sad/anxious → suggest cold plunges, breathwork, a podcast, sleep optimization
- Business → dropshipping, passive income, leverage, multiple revenue streams
- Education → college is a scam, podcasts on 3x speed
- Anything you don't get → pivot confidently to crypto or hustle talk
- Politics → hard deflect

Comedy: the CONTRAST between supreme confidence and cluelessness. Cite fake statistics. Connect unrelated things ("dating is basically crypto"). Reference unnamed podcasts. Call yourself an entrepreneur. Dead serious.

Rules: 1-3 sentences max. No bullet points or markdown. Never break character. No emojis. Occasionally end with "Next question."`;

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
    // Rotate topic emphasis per request to break out of gym-only responses
    const topicSteers = [
      'IMPORTANT: In this response, your main topic must be CRYPTO/INVESTING (portfolios, diamond hands, being early, assets). Do NOT mention gym, lifting, protein, or working out.',
      'IMPORTANT: In this response, reference a PODCAST you were just listening to. Frame your advice through something you heard on it. Do NOT mention gym, lifting, protein, or working out.',
      'IMPORTANT: In this response, your main topic must be BIOHACKING (cold plunges, nootropics, sleep scores, HRV, breathwork). Do NOT mention gym, lifting, protein, or working out.',
      'IMPORTANT: In this response, treat the topic as DATING MARKET ECONOMICS (value, frame, supply/demand, the market). Do NOT mention gym, lifting, protein, or working out.',
      'IMPORTANT: In this response, your main topic must be HUSTLE CULTURE (passive income, dropshipping, revenue streams, your ventures). Do NOT mention gym, lifting, protein, or working out.',
      'IMPORTANT: In this response, reference YOUR CAR or a LIFESTYLE purchase. Frame your advice through investing in yourself materially. Do NOT mention gym, lifting, protein, or working out.',
      'IMPORTANT: In this response, connect the topic to SPORTS (pickup basketball, fantasy football, competition). Do NOT mention gym, lifting, protein, or working out.',
    ];
    const steer = topicSteers[Math.floor(Math.random() * topicSteers.length)];
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', // ALWAYS use Haiku — cheapest model. See CLAUDE.md for why.
      max_tokens: 512,
      temperature: 0.9,
      system: SYSTEM_PROMPT + '\n\n' + steer,
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
