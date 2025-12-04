/**
 * SERVER ACTIONS - Cookie-Based Cart Management
 *
 * This file demonstrates how to use HTTP-only cookies in Next.js Server Actions.
 * Server Actions run on the server, allowing us to securely manage cookies without
 * exposing them to client-side JavaScript.
 */

// The 'use server' directive tells Next.js this file contains Server Actions
// These functions run on the server, not in the browser
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  parseCart,
  serializeCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";
import { CartItem } from "@/types/product";

/**
 * COOKIE SECURITY OPTIONS
 *
 * These options control how cookies are stored and transmitted:
 *
 * - httpOnly: true
 *   Prevents JavaScript from accessing the cookie (XSS protection)
 *   The cookie can ONLY be read/written by the server
 *
 * - secure: true (in production)
 *   Cookie is only sent over HTTPS connections
 *   Prevents interception over unencrypted connections
 *
 * - sameSite: 'lax'
 *   Protects against CSRF attacks
 *   Cookie is sent with same-site requests and top-level navigations
 *
 * - maxAge: 30 days
 *   How long the cookie persists (in seconds)
 *   After this time, the cookie expires and is deleted
 *
 * - path: '/'
 *   Cookie is available site-wide
 *   If set to '/cart', cookie would only be sent to /cart routes
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
  path: "/",
};

/**
 * Helper function to save cart data to cookie
 *
 * Steps:
 * 1. Get the cookie store (must be awaited in Next.js 15+)
 * 2. Serialize cart items to JSON string (cookies only store strings)
 * 3. Set the cookie with our security options
 * 4. Revalidate pages that display cart data (forces Next.js to refresh)
 */
async function setCartCookie(items: CartItem[]) {
  // cookies() returns a cookie store - must be awaited in Next.js 15+
  const cookieStore = await cookies();

  // Set the cookie: name='cart', value=JSON string, options=security settings
  cookieStore.set("cart", serializeCart(items), COOKIE_OPTIONS);

  // Tell Next.js to refresh these pages on next request
  // This ensures the UI shows updated cart data
  revalidatePath("/");
  revalidatePath("/cart");
}

/**
 * Add an item to the cart
 *
 * This is a Server Action - it can be called from forms or client components
 * FormData is automatically passed when called from a <form action={...}>
 *
 * Flow:
 * 1. Extract productId from form submission
 * 2. Read current cart from cookie
 * 3. Add new item (or increment quantity if exists)
 * 4. Save updated cart back to cookie
 */
export async function addItemToCart(formData: FormData) {
  // Extract data from form submission
  const productId = formData.get("productId") as string;

  // Read current cart from cookie
  const cookieStore = await cookies();
  const cart = parseCart(cookieStore.get("cart")?.value);

  // Add item and save to cookie
  await setCartCookie(addToCart(cart, productId, 1));
}

/**
 * Remove an item from the cart
 *
 * Similar flow to addItemToCart, but removes the item instead
 */
export async function removeItem(formData: FormData) {
  const productId = formData.get("productId") as string;
  const cookieStore = await cookies();
  const cart = parseCart(cookieStore.get("cart")?.value);

  // Remove item and save updated cart
  await setCartCookie(removeFromCart(cart, productId));
}

/**
 * Update the quantity of an item in the cart
 *
 * Used when user clicks +/- buttons
 * If quantity becomes 0 or less, the item is removed
 */
export async function updateQuantity(formData: FormData) {
  const productId = formData.get("productId") as string;
  const quantity = parseInt(formData.get("quantity") as string);

  const cookieStore = await cookies();
  const cart = parseCart(cookieStore.get("cart")?.value);

  // Update quantity and save
  await setCartCookie(updateCartQuantity(cart, productId, quantity));
}

/**
 * Read cart data from cookie
 *
 * This function is used by Server Components to display cart contents
 * Returns an array of CartItem objects
 *
 * Note: This runs on the server, so the cookie is accessible
 * Client-side JavaScript CANNOT read httpOnly cookies
 */
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();

  // Get cookie value (undefined if cookie doesn't exist)
  // Parse JSON string back to array of CartItem objects
  return parseCart(cookieStore.get("cart")?.value);
}

/**
 * Clear the entire cart
 *
 * To delete a cookie, we set it with maxAge: 0
 * This tells the browser to immediately expire and delete it
 */
export async function clearCart() {
  const cookieStore = await cookies();

  // Delete cookie by setting maxAge to 0
  cookieStore.set("cart", "", { maxAge: 0, path: "/" });

  // Refresh pages to show empty cart
  revalidatePath("/");
  revalidatePath("/cart");
}
