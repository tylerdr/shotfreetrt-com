export const BLUEPRINT_PRODUCT_KEY = "longevity_blueprint_2026";
export const BLUEPRINT_PRODUCT_NAME = "The Longevity Blueprint (2026 Edition)";
export const BLUEPRINT_PRICE_ID = "price_1T7LXwCrDNIXmbyxFxKhIyOT";
export const BLUEPRINT_PRICE_CENTS = 1900;
export const BLUEPRINT_CURRENCY = "USD" as const;

export const BLUEPRINT_ITEM = {
  item_id: BLUEPRINT_PRODUCT_KEY,
  item_name: BLUEPRINT_PRODUCT_NAME,
  price: BLUEPRINT_PRICE_CENTS / 100,
  quantity: 1
} as const;

export type BlueprintPurchase = {
  transactionId: string;
  value: number;
  currency: typeof BLUEPRINT_CURRENCY;
  items: [typeof BLUEPRINT_ITEM];
};
