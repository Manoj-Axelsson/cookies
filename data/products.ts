import { Product } from '@/types/product';

export const products: Product[] = [
  { id: '1', name: 'Headphones', price: 199.99 },
  { id: '2', name: 'Smart Watch', price: 299.99 },
  { id: '3', name: 'Laptop Stand', price: 49.99 },
  { id: '4', name: 'Keyboard', price: 149.99 },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

