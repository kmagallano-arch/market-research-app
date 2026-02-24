export const MARKETS = {
  US: { label: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', platform: 'Amazon US', color: '#2E6FFF' },
  PH: { label: 'Philippines',   flag: '🇵🇭', currency: 'PHP', symbol: '₱', platform: 'Shopee · Lazada', color: '#FF4D6A' },
  UK: { label: 'United Kingdom',flag: '🇬🇧', currency: 'GBP', symbol: '£', platform: 'Amazon UK', color: '#8B5CF6' },
  DE: { label: 'Germany',       flag: '🇩🇪', currency: 'EUR', symbol: '€', platform: 'Amazon DE', color: '#FFB830' },
  NL: { label: 'Netherlands',   flag: '🇳🇱', currency: 'EUR', symbol: '€', platform: 'Bol.com · Amazon NL', color: '#00C48C' },
  SE: { label: 'Sweden',        flag: '🇸🇪', currency: 'SEK', symbol: 'kr', platform: 'Amazon SE · CDON', color: '#FF8C42' },
  NO: { label: 'Norway',        flag: '🇳🇴', currency: 'NOK', symbol: 'kr', platform: 'Amazon · Finn.no', color: '#E879F9' },
}

export type MarketCode = keyof typeof MARKETS
export const MARKET_CODES = Object.keys(MARKETS) as MarketCode[]
