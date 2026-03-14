# @affectively/utils

`@affectively/utils` is a small set of shared TypeScript utilities for recurring application tasks.

The fair brag is that it stays small and focused. The package gives you API retry helpers, a simple logger, and short-code helpers without making you pull in a giant grab bag.

## What You Get

- `fetchWithRetry` and `fetchJsonWithRetry` for request retry flows
- `logger` for consistent application logging
- `generateShortCode` and `createShortUrl` for short-link generation

## Installation

```bash
npm install @affectively/utils
# or
bun add @affectively/utils
```

## Quick Start

```ts
import {
  fetchWithRetry,
  logger,
  generateShortCode,
} from '@affectively/utils';

const response = await fetchWithRetry('/api/data', { method: 'GET' }, {
  maxRetries: 3,
  getToken: async () => localStorage.getItem('token'),
});

logger.info('Request completed', { status: response.status });

const code = generateShortCode();
```

## Why This README Is Grounded

Utils does not need to be more than it is. The strongest fair brag is that it gives you a few genuinely reusable helpers in a package small enough to understand immediately.
