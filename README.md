# Next.js Cookie Cart Example

Minimal example demonstrating how to implement a shopping cart using cookies in Next.js 16.

## How It Works

Cart data is stored in an HTTP-only cookie. All operations use Next.js Server Actions.

### Cookie Structure

```json
[
  { "productId": "1", "quantity": 2 },
  { "productId": "3", "quantity": 1 }
]
```

### Key Files

- `app/actions/cart.ts` - Server actions for cart operations
- `lib/cart.ts` - Cart utility functions
- `app/page.tsx` - Product listing
- `app/cart/page.tsx` - Cart page

### Cookie Security

- `httpOnly: true` - Prevents JavaScript access
- `secure: true` - HTTPS only in production
- `sameSite: 'lax'` - CSRF protection
- `maxAge: 30 days` - Persistent cart

## Run

```bash
npm install
npm run dev
```
