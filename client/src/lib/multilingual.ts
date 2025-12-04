// Simplified multilingual utility for pricing
export const currencyConfig: Record<string, { code: string; symbol: string; name: string }> = {
  'en-GB': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'en-US': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'en-CA': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'en-AU': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'de-DE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'fr-FR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'es-ES': { code: 'EUR', symbol: '€', name: 'Euro' },
  'it-IT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'nl-NL': { code: 'EUR', symbol: '€', name: 'Euro' },
  'pt-PT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'be-BE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'at-AT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'ie-IE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'fi-FI': { code: 'EUR', symbol: '€', name: 'Euro' },
  'gr-GR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'se-SE': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  'no-NO': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  'dk-DK': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  'is-IS': { code: 'ISK', symbol: 'kr', name: 'Icelandic Krona' },
  'jp-JP': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'kr-KR': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  'cn-CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'in-IN': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'sg-SG': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  'hk-HK': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  'br-BR': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  'mx-MX': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  'ar-AR': { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  'ae-AE': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'sa-SA': { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  'za-ZA': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'ng-NG': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  'ke-KE': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'eg-EG': { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  'pl-PL': { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  'cz-CZ': { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  'hu-HU': { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  'ro-RO': { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  'bg-BG': { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  'hr-HR': { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  'rs-RS': { code: 'RSD', symbol: 'дин', name: 'Serbian Dinar' },
  'ua-UA': { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  'ch-CH': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  'tr-TR': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  'ru-RU': { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
};

// Simplified exchange rates (1 GBP = X)
export const exchangeRates: Record<string, number> = {
  'GBP': 1,
  'USD': 1.27,
  'CAD': 1.72,
  'AUD': 1.92,
  'EUR': 1.17,
  'SEK': 13.2,
  'NOK': 13.5,
  'DKK': 8.7,
  'ISK': 175,
  'JPY': 188,
  'KRW': 1690,
  'CNY': 9.1,
  'INR': 105,
  'SGD': 1.71,
  'HKD': 9.9,
  'BRL': 6.3,
  'MXN': 21.5,
  'ARS': 1080,
  'AED': 4.66,
  'SAR': 4.76,
  'ZAR': 23.8,
  'NGN': 1600,
  'KES': 165,
  'EGP': 39,
  'PLN': 5.0,
  'CZK': 29.5,
  'HUF': 450,
  'RON': 5.8,
  'BGN': 2.3,
  'HRK': 8.4,
  'RSD': 137,
  'UAH': 49,
  'CHF': 1.12,
  'TRY': 41,
  'RUB': 117,
};

export const countryNames: Record<string, string> = {
  'en-GB': 'United Kingdom',
  'en-US': 'United States',
  'en-CA': 'Canada',
  'en-AU': 'Australia',
  'de-DE': 'Germany',
  'fr-FR': 'France',
  'es-ES': 'Spain',
  'it-IT': 'Italy',
  'nl-NL': 'Netherlands',
  'pt-PT': 'Portugal',
  'be-BE': 'Belgium',
  'at-AT': 'Austria',
  'ie-IE': 'Ireland',
  'fi-FI': 'Finland',
  'gr-GR': 'Greece',
  'se-SE': 'Sweden',
  'no-NO': 'Norway',
  'dk-DK': 'Denmark',
  'is-IS': 'Iceland',
  'jp-JP': 'Japan',
  'kr-KR': 'South Korea',
  'cn-CN': 'China',
  'in-IN': 'India',
  'sg-SG': 'Singapore',
  'hk-HK': 'Hong Kong',
  'br-BR': 'Brazil',
  'mx-MX': 'Mexico',
  'ar-AR': 'Argentina',
  'ae-AE': 'UAE',
  'sa-SA': 'Saudi Arabia',
  'za-ZA': 'South Africa',
  'ng-NG': 'Nigeria',
  'ke-KE': 'Kenya',
  'eg-EG': 'Egypt',
  'pl-PL': 'Poland',
  'cz-CZ': 'Czech Republic',
  'hu-HU': 'Hungary',
  'ro-RO': 'Romania',
  'bg-BG': 'Bulgaria',
  'hr-HR': 'Croatia',
  'rs-RS': 'Serbia',
  'ua-UA': 'Ukraine',
  'ch-CH': 'Switzerland',
  'tr-TR': 'Turkey',
  'ru-RU': 'Russia',
};

export function convertPrice(priceGBP: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency] || 1;
  return priceGBP * rate;
}

export function formatPrice(price: number, currency: string, locale: string): string {
  const config = currencyConfig[locale] || currencyConfig['en-GB'];
  const symbol = config.symbol;
  
  // Format number based on currency
  if (currency === 'JPY' || currency === 'KRW' || currency === 'VND') {
    return `${symbol}${Math.round(price).toLocaleString(locale)}`;
  }
  
  return `${symbol}${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function getBrowserLocale(): string {
  if (typeof window === 'undefined') return 'en-GB';
  const browserLocale = navigator.language || (navigator as any).userLanguage || 'en-GB';
  return browserLocale;
}

export function getTranslation(key: string, locale?: string): string {
  // Simplified translation - just return key for now
  return key;
}

