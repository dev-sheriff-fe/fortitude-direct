export type CurrencyCode =
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'NGN'
  | 'INR'
  | 'CNY'
  | 'ZAR'
  | 'GHS';

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  NGN: "₦",
  INR: "₹",
  CNY: "¥",
  ZAR: "R",
  GHS: "₵" // Ghana Cedis
};

export function formatPrice(amount: number, currencyCode: CurrencyCode): string {
  const symbol = currencySymbols[currencyCode];
  
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${symbol}${formattedAmount}`;
}

// Example usage
console.log(formatPrice(500, "GHS")); // ₵500.00
console.log(formatPrice(1000, "USD")); // $1,000.00
