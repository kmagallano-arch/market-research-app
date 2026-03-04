export const MARKETS = {
  US: { label: 'United States',  flag: '🇺🇸', currency: 'USD', symbol: '$',  platform: 'Amazon US',           color: '#0EA5E9' },
  UK: { label: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£',  platform: 'Amazon UK',           color: '#8B5CF6' },
  DE: { label: 'Germany',        flag: '🇩🇪', currency: 'EUR', symbol: '€',  platform: 'Amazon DE · Otto',    color: '#FFB830' },
  FR: { label: 'France',         flag: '🇫🇷', currency: 'EUR', symbol: '€',  platform: 'Amazon FR · Cdiscount',color: '#E30613' },
  NL: { label: 'Netherlands',    flag: '🇳🇱', currency: 'EUR', symbol: '€',  platform: 'Bol.com · Amazon NL', color: '#00C48C' },
  BE: { label: 'Belgium',        flag: '🇧🇪', currency: 'EUR', symbol: '€',  platform: 'Bol.com · Amazon BE', color: '#6366F1' },
  SE: { label: 'Sweden',         flag: '🇸🇪', currency: 'SEK', symbol: 'kr', platform: 'Amazon SE · CDON',    color: '#FF8C42' },
  NO: { label: 'Norway',         flag: '🇳🇴', currency: 'NOK', symbol: 'kr', platform: 'Amazon · Finn.no',    color: '#E879F9' },
  AU: { label: 'Australia',      flag: '🇦🇺', currency: 'AUD', symbol: 'A$', platform: 'Amazon AU · eBay AU', color: '#0EA5E9' },
  PH: { label: 'Philippines',    flag: '🇵🇭', currency: 'PHP', symbol: '₱',  platform: 'Shopee · Lazada',     color: '#FF4D6A' },
}

export type MarketCode = keyof typeof MARKETS
export const MARKET_CODES = Object.keys(MARKETS) as MarketCode[]
