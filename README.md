# Clnk URL Shortener SDK

A TypeScript SDK for interacting with the Clnk URL shortener GraphQL API.

## Features

- Create and manage short URLs
- Generate QR codes for short URLs
- Authentication (login, register, token refresh)
- API key management
- TypeScript support with full type definitions

## Installation

```bash
npm install @tryclnk/sdk
# or
yarn add @tryclnk/sdk
```

## Quick Start

```typescript
import { ClnkSDK } from '@tryclnk/sdk';

// Initialize the SDK
const sdk = new ClnkSDK({
  apiKey: 'optional-api-key', // Optional
  accessToken: 'your-access-token' // Optional, can be set later with sdk.setAccessToken()
});

// Login
const auth = await sdk.login({
  email: 'user@example.com',
  password: 'password123'
});

// Create a short URL
const shortUrl = await sdk.createUrl({
  url: 'https://example.com/very-long-url',
  shorten: true // Let the API auto-generate a short code
});

// Generate a QR code URL
const qrCodeUrl = sdk.generateQRCodeUrl(shortUrl.shortUrl);
```

## Authentication

### Login

```typescript
const authData = await sdk.login({
  email: 'user@example.com',
  password: 'password123'
});

// The SDK automatically saves the access token for future requests
console.log(authData.accessToken);
console.log(authData.refreshToken);
console.log(authData.user);
```

### Register

```typescript
const registerData = await sdk.register({
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123'
});
```

### Refresh Token

```typescript
const refreshData = await sdk.refreshToken('your-refresh-token');
// The SDK automatically saves the new access token
```

### Set Access Token Manually

```typescript
sdk.setAccessToken('your-access-token');
```

## URL Management

### Create URL

```typescript
// Auto-generated short code
const url1 = await sdk.createUrl({
  url: 'https://example.com/long-url',
  shorten: true
});

// Custom short code
const url2 = await sdk.createUrl({
  url: 'https://example.com/long-url',
  code: 'custom-code'
});

// With an image (for visual links)
const url3 = await sdk.createUrl({
  url: 'https://example.com/long-url',
  shorten: true,
  image: 'https://example.com/image.jpg'
});
```

### Update URL

```typescript
const updatedUrl = await sdk.updateUrl({
  id: 'url-id',
  url: 'https://example.com/updated-url',
  shortUrl: 'new-custom-code'
});
```

### Delete URL

```typescript
const deleted = await sdk.deleteUrl('url-id');
```

### Get URL

```typescript
// By ID
const url1 = await sdk.getUrl({ id: 'url-id' });

// By code
const url2 = await sdk.getUrl({ code: 'abc123' });
```

### Get URLs

```typescript
// Get user's URLs
const urlData = await sdk.getUrls({
  pagination: { page: 1, limit: 10 }
});

// With filtering
const filteredUrls = await sdk.getUrls({
  filter: {
    url: 'example.com'
  },
  pagination: { page: 1, limit: 20 }
});
```

### Get All URLs (Admin)

```typescript
const allUrls = await sdk.getAllUrls({
  pagination: { page: 1, limit: 50 }
});
```

## QR Code Generation

```typescript
// Default size (300x300)
const qrUrl1 = sdk.generateQRCodeUrl('https://clnk.to/abc123');

// Custom size
const qrUrl2 = sdk.generateQRCodeUrl('https://clnk.to/abc123', 500);
```

## API Key Management

```typescript
// Generate new API key
const apiKey = await sdk.generateApiKey();
```

## User Management

```typescript
// Get current user info
const currentUser = await sdk.getCurrentUser();
```

## License

MIT
