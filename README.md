# @affectively/utils

TypeScript utility functions for common development tasks.

[![npm version](https://img.shields.io/npm/v/@affectively/utils.svg)](https://www.npmjs.com/package/@affectively/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **API Retry** - Automatic retry with authentication token refresh
- **Logger** - Simple, consistent logging utility
- **Short URL** - Generate cryptographically secure short codes

## Installation

```bash
npm install @affectively/utils
# or
yarn add @affectively/utils
# or
bun add @affectively/utils
```

## Quick Start

```typescript
import { fetchWithRetry, logger, generateShortCode } from '@affectively/utils';

// API retry with auth
const response = await fetchWithRetry('/api/data', {
 method: 'GET'
}, {
 maxRetries: 3,
 getToken: async () => localStorage.getItem('token')
});

// Logging
logger.info('Request completed', { status: response.status });

// Short URL generation
const code = generateShortCode(); // e.g., "xK9mN2pL"
```

## API Reference

### API Retry

Automatically retry failed API requests with token refresh.

```typescript
import { fetchWithRetry, fetchJsonWithRetry } from '@affectively/utils/api-retry';

// Basic retry
const response = await fetchWithRetry(url, options, {
 maxRetries: 2,
 getToken: async () => getAuthToken(),
 isAuthError: (response) => response.status === 401
});

// JSON retry with auto-parsing
const data = await fetchJsonWithRetry<MyType>(url, options, retryOptions);
```

### Logger

Simple logging with consistent formatting.

```typescript
import { logger } from '@affectively/utils/logger';

logger.debug('Debug message', { context: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Short URL

Generate cryptographically secure short codes.

```typescript
import { generateShortCode, createShortUrl } from '@affectively/utils/short-url';

// Generate 8-character base62 code
const code = generateShortCode(); // "xK9mN2pL"

// Create full short URL
const url = createShortUrl(code, 'https://mysite.com'); // "https://mysite.com/s/xK9mN2pL"
```

## Tree-Shakeable Imports

Import only what you need:

```typescript
// Import everything
import { fetchWithRetry, logger, generateShortCode } from '@affectively/utils';

// Or import specific modules
import { fetchWithRetry } from '@affectively/utils/api-retry';
import { logger } from '@affectively/utils/logger';
import { generateShortCode } from '@affectively/utils/short-url';
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

Made with ️ by [AFFECTIVELY](https://affectively.ai)
