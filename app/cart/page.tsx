import Link from 'next/link';
import { getCart, clearCart } from '@/app/actions/cart';
import { getProductById } from '@/data/products';
import { CartItemWithProduct } from '@/types/product';
import { CartItem } from '@/components/CartItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function CartPage() {
  const cart = await getCart();
  const items: CartItemWithProduct[] = cart
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItemWithProduct => item !== null);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cart</h1>
        <Button variant="ghost" asChild>
          <Link href="/">← Back</Link>
        </Button>
      </div>
      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-xl mb-4">Cart is empty</p>
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 space-y-2">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={clearCart}>
                <Button type="submit" variant="outline" className="w-full">
                  Clear Cart
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

