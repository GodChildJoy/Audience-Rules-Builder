import { spawnSync } from 'node:child_process';

/**
 * Injects AUDIENCE_RULES_API_URL into the Angular bundle via CLI --define.
 * On Vercel, set AUDIENCE_RULES_API_URL to your Railway API origin (no trailing slash).
 */
const url = process.env.AUDIENCE_RULES_API_URL ?? '';
const defineValue = JSON.stringify(url);

const result = spawnSync(
  'npx',
  ['ng', 'build', '--configuration=production', `--define=__AUDIENCE_RULES_API_URL__=${defineValue}`],
  { stdio: 'inherit', shell: process.platform === 'win32' },
);

process.exit(result.status ?? 1);
