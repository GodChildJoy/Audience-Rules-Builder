/**
 * Build-time URL for the Audience Rules REST API (Railway in production).
 * Set via `ng build --define=__AUDIENCE_RULES_API_URL__='\"https://your-api.up.railway.app\"'`
 * or the `build:vercel` npm script (reads AUDIENCE_RULES_API_URL from the environment).
 */
declare const __AUDIENCE_RULES_API_URL__: string;

export function audienceRulesApiBaseUrl(): string {
  const v = typeof __AUDIENCE_RULES_API_URL__ !== 'undefined' ? __AUDIENCE_RULES_API_URL__ : '';
  const trimmed = String(v).trim().replace(/\/$/, '');
  if (trimmed) {
    return trimmed;
  }
  return 'http://localhost:3000';
}
