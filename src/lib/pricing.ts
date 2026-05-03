export const SIZE_MULTIPLIERS: Record<string, number> = {
  "A4 Print": 1.0,
  "A3 Print": 1.5,
  "A2 Print": 2.5,
  "Digital Download": 0.6,
};

export const SHIPPING_RATES: Record<number, { name: string; cost: number }> = {
  1: { name: "Local City", cost: 150 },
  2: { name: "National", cost: 250 },
  3: { name: "Neighboring Country", cost: 500 },
  4: { name: "International", cost: 1500 },
};

export function calculatePrice(basePrice: string | number, size: string): number {
  const base = typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;
  const multiplier = SIZE_MULTIPLIERS[size] ?? 1.0;
  return Math.round(base * multiplier);
}

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}
