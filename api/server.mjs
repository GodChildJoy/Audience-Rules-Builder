import cors from 'cors';
import express from 'express';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT) || 3000;

/**
 * Comma-separated list of allowed browser origins (your Vercel URL(s)).
 * Example: https://audience-rules.vercel.app,https://audience-rules-git-main-xxx.vercel.app
 * Omit or set to * for local-only / quick tests (not recommended for production).
 */
const corsOriginEnv = process.env.CORS_ORIGIN?.trim();
const corsOptions =
  !corsOriginEnv || corsOriginEnv === '*'
    ? { origin: true }
    : { origin: corsOriginEnv.split(',').map((s) => s.trim()) };

const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

/** @type {Array<Record<string, unknown>>} */
const rules = [];

const demoMatches = [
  { name: 'Morgan Lee', email: 'morgan.lee@example.com' },
  { name: 'Jordan Park', email: 'jordan.park@example.com' },
  { name: 'Riley Chen', email: 'riley.chen@example.com' },
];

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/rules', (_req, res) => {
  res.json(rules);
});

app.post('/rules', (req, res) => {
  const body = req.body;
  if (!body || typeof body.name !== 'string' || !body.root) {
    res.status(400).json({ error: 'Expected { name, root, savedAt? }' });
    return;
  }
  const storedAt = new Date().toISOString();
  const saved = {
    id: randomUUID(),
    name: body.name,
    root: body.root,
    savedAt: body.savedAt ?? storedAt,
    storedAt,
  };
  rules.push(saved);
  res.status(201).json(saved);
});

app.delete('/rules/:id', (req, res) => {
  const i = rules.findIndex((r) => r.id === req.params.id);
  if (i === -1) {
    res.status(404).end();
    return;
  }
  rules.splice(i, 1);
  res.status(204).end();
});

/** Demo evaluation: returns sample contacts (replace with real matching logic later). */
app.post('/evaluate', (req, res) => {
  if (!req.body || typeof req.body.root !== 'object' || req.body.root === null) {
    res.status(400).json({ error: 'Expected { root }' });
    return;
  }
  res.json({ matches: demoMatches });
});

app.listen(PORT, () => {
  console.log(`Audience rules API listening on port ${PORT}`);
});
