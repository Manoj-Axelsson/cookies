import Link from 'next/link';
import { getCart } from '@/app/actions/cart';
import { getCartTotal } from '@/lib/cart';
import { Button } from '@/components/ui/button';

export async function CartBadge() {
  const cart = await getCart();
  const total = getCartTotal(cart);
  return (
    <Button asChild>
      <Link href="/cart">Cart ({total})</Link>
    </Button>
  );
}

