import { createClient } from '@de-fi/sdk';

if (!process.env.DEFI_API_KEY) {
  throw new Error('Missing DEFI_API_KEY environment variable');
}

export const defi = createClient({
  url: 'https://public-api.de.fi/graphql',
  headers: {
    'X-Api-Key': process.env.DEFI_API_KEY as string
  }
});

