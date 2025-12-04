/**
 * CART UTILITY FUNCTIONS
 *
 * These are pure functions that manipulate cart data.
 * They don't interact with cookies directly - that's handled in cart.ts actions.
 *
 * Why separate these?
 * - Easier to test (no need to mock cookies)
 * - Reusable logic
 * - Clear separation of concerns
 */

import { CartItem } from "@/types/product";

/**
 * Parse cookie string into CartItem array
 *
 * Cookies store strings, but we need an array of objects.
 * This function converts the JSON string back to JavaScript objects.
 */
export function parseCart(cartCookie: string | undefined): CartItem[] {
  // If no cookie exists, return empty cart
  if (!cartCookie) return [];

  try {
    // Parse JSON string to JavaScript array
    // Example: '[]' -> []
    // Example: '[{"productId":"1","quantity":2}]' -> [{productId:"1",quantity:2}]
    return JSON.parse(cartCookie) as CartItem[];
  } catch {
    // If JSON is invalid, return empty array instead of crashing
    return [];
  }
}

/**
 * Convert CartItem array to JSON string for cookie storage
 *
 * Cookies can only store strings, so we need to serialize our data.
 * Example: [{productId:"1",quantity:2}] -> '[{"productId":"1","quantity":2}]'
 */
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

/**
 * Add an item to the cart, or increment quantity if it already exists
 */
export function addToCart(
  items: CartItem[],
  productId: string,
  quantity: number = 1
): CartItem[] {
  // Check if product is already in cart
  const existingItem = items.find((item) => item.productId === productId);

  if (existingItem) {
    // Product exists: increment quantity
    // Map through items, updating the matching one
    return items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  // Product doesn't exist: add new item to cart
  // Spread operator creates new array (immutability)
  return [...items, { productId, quantity }];
}

/**
 * Remove an item from the cart
 */
export function removeFromCart(
  items: CartItem[],
  productId: string
): CartItem[] {
  // Filter out the item with matching productId
  return items.filter((item) => item.productId !== productId);
}

/**
 * Update the quantity of an item in the cart
 * If quantity becomes 0 or less, the item is removed
 */
export function updateCartQuantity(
  items: CartItem[],
  productId: string,
  quantity: number
): CartItem[] {
  // If quantity is 0 or negative, remove the item instead
  if (quantity <= 0) {
    return removeFromCart(items, productId);
  }

  // Update quantity for matching item
  return items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );
}

/**
 * Calculate total number of items in cart
 *
 * This counts quantities, not unique products.
 * Example: [qty:2, qty:3] = 5 total items
 */
export function getCartTotal(items: CartItem[]): number {
  // Sum all quantities using reduce
  return items.reduce((total, item) => total + item.quantity, 0);
}
