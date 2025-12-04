import { CartItemWithProduct } from '@/types/product';
import { updateQuantity, removeItem } from '@/app/actions/cart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CartItem({ item }: { item: CartItemWithProduct }) {
  const total = item.product.price * item.quantity;
  
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex-1">
          <h3 className="font-semibold">{item.product.name}</h3>
          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <form action={updateQuantity}>
              <input type="hidden" name="productId" value={item.productId} />
              <input type="hidden" name="quantity" value={item.quantity - 1} />
              <Button type="submit" size="icon" variant="outline" disabled={item.quantity <= 1}>
                -
              </Button>
            </form>
            <span className="w-8 text-center">{item.quantity}</span>
            <form action={updateQuantity}>
              <input type="hidden" name="productId" value={item.productId} />
              <input type="hidden" name="quantity" value={item.quantity + 1} />
              <Button type="submit" size="icon" variant="outline">+</Button>
            </form>
          </div>
          <p className="font-semibold w-20 text-right">${total.toFixed(2)}</p>
          <form action={removeItem}>
            <input type="hidden" name="productId" value={item.productId} />
            <Button type="submit" variant="destructive" size="sm">Remove</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

