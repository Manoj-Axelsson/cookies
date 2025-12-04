import Link from 'next/link';
import { CartBadge } from './CartBadge';

export function Navigation() {
  return (
    <nav className="border-b mb-8 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Shop</Link>
        <CartBadge />
      </div>
    </nav>
  );
}

