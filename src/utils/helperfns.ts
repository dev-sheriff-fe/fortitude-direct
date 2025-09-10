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
export const fileUrlFormatted = (fileUrl:string):string=> `/${fileUrl.split('/').pop()}` || '' 


export function generateRandomNumber(length: number) {
  if (length <= 0) throw new Error("Length must be greater than 0");
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get current date formatted as dd-mm-yy
 * @returns {string}
 */
export function getCurrentDate() {
  // Return a default date for SSR, real date on client
  if (typeof window === 'undefined') {
    return '01-01-24'; // Default fallback for SSR
  }
  
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

// Example:
console.log(getCurrentDate()); 
// 👉 "20-08-25"


export function timestampToDays(timestamp:number) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // 86,400,000 ms
    return timestamp / millisecondsPerDay;
}

export const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    "active": "bg-green-500 text-white",
    "verified": "bg-green-500 text-white",
    "completed": "bg-green-500 text-white", 
    "pending": "bg-yellow-500 text-white",
    "suspended": "bg-red-500 text-white",
    "rejected": "bg-red-500 text-white",
    "failed": "bg-red-500 text-white",
    "n": "bg-red-500 text-white",
    "y": "bg-green-500 text-white",
    "success": "bg-green-500 text-white"
  };
  
  return variants[status?.toLowerCase()] || "bg-gray-500 text-gray-400";
};

export const formatDateToDDMMYYYY = (date?: Date | string): string => {
  const dateObj = date ? new Date(date) : new Date();
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  // Get day, month, and full year
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();
  
  return `${day}-${month}-${year}`;
};

