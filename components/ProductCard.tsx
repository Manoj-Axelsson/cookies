import { Product } from '@/types/product';
import { addItemToCart } from '@/app/actions/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
        <form action={addItemToCart}>
          <input type="hidden" name="productId" value={product.id} />
          <Button type="submit">Add to Cart</Button>
        </form>
      </CardContent>
    </Card>
  );
}

