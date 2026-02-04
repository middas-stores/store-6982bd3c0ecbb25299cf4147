# Guía de Desarrollo - E-commerce Template

## Configuración

### Prerequisitos

```bash
Node.js >= 18.18.0
npm >= 9.0.0
```

**Herramientas recomendadas**:
- VS Code + extensiones: Tailwind IntelliSense, ESLint, Prettier
- React DevTools (navegador)

### Setup

```bash
cd middas-ecommerce-template1
npm install

# Crear .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STORE_URL=mi-tienda-online

# Verificar backend
curl http://localhost:5000/api/public/store/mi-tienda-online/config

# Ejecutar
npm run dev  # http://localhost:3000
```

---

## Estructura

```
/app         # Next.js App Router
/components  # React components
  /ui        # Componentes base (Radix)
  /layout    # Header, Footer
/lib         # Utilidades
/hooks       # Custom hooks
/types       # TypeScript types
/public      # Assets estáticos
```

---

## Convenciones

### Nombres de Archivos

```
# Componentes: PascalCase.tsx
ProductCard.tsx, CheckoutForm.tsx

# Hooks: use-camelCase.ts
use-cart.ts, use-products.ts

# Utils: camelCase.ts
api.ts, utils.ts, validations.ts
```

### Estructura de Componente

```tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ===================================
  // HANDLERS
  // ===================================
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  // ===================================
  // RENDER
  // ===================================
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <Image src={product.images[0]} alt={product.name} width={300} height={300} />
      <h3 className="mt-4 font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <Button onClick={handleAddToCart}>Agregar al carrito</Button>
    </div>
  );
}
```

---

## Server vs Client

### Server (Default)

```tsx
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

### Client

```tsx
'use client';

import { useState } from 'react';

export function AddToCartButton({ product }) {
  const [loading, setLoading] = useState(false);
  const cart = useCart();

  const handleClick = async () => {
    setLoading(true);
    await cart.addItem(product, 1);
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Agregando...' : 'Agregar'}
    </button>
  );
}
```

**Usar Client para**:
- Hooks (useState, useEffect)
- Event handlers
- Browser APIs
- Third-party hooks

---

## TypeScript

### Types

```typescript
// types/product.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  category: Category;
}

export interface Category {
  _id: string;
  name: string;
}
```

### Uso

```tsx
interface Props {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: Props) {
  // TypeScript infiere tipos
}
```

---

## Forms (React Hook Form + Zod)

### Schema

```typescript
import { z } from 'zod';

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(3),
    email: z.string().email(),
  }),
  shipping: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

### Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    await createOrder(data);
    router.push('/checkout/success');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('customer.name')} />
      {errors.customer?.name && <span>{errors.customer.name.message}</span>}

      <button type="submit">Confirmar</button>
    </form>
  );
}
```

---

## TailwindCSS

### Clases Comunes

```jsx
// Layout
<div className="container mx-auto px-4 py-8">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Typography
<h1 className="text-3xl font-bold">
<p className="text-gray-600 text-sm">

// Interactive
<button className="bg-blue-500 hover:bg-blue-600 transition">

// Dark mode
<div className="bg-white dark:bg-gray-900">

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
```

### CVA (Class Variance Authority)

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center rounded-md transition',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        outline: 'border border-gray-300 hover:bg-gray-100',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
```

---

## Dark Mode

### Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Toggle

```tsx
'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle
    </button>
  );
}
```

---

## API Calls

### Client

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL;

export async function getProducts() {
  const res = await fetch(`${API_URL}/public/store/${STORE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return data.products;
}
```

### Server Component

```tsx
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

### Client Component

```tsx
'use client';

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  return <ProductGrid products={products} />;
}
```

---

## State (Zustand)

```typescript
// hooks/use-cart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => set(/* ... */),
      removeItem: (productId) => set(/* ... */),
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    { name: 'cart-storage' }
  )
);
```

### Uso

```tsx
'use client';

export function CartSummary() {
  const { items, total, removeItem } = useCart();

  return (
    <div>
      {items.map(item => (
        <div key={item.product._id}>
          {item.product.name} x {item.quantity}
          <button onClick={() => removeItem(item.product._id)}>Eliminar</button>
        </div>
      ))}
      <p>Total: ${total}</p>
    </div>
  );
}
```

---

## Optimizaciones

### Images

```tsx
import Image from 'next/image';

<Image src={product.image} alt={product.name} width={400} height={400} loading="lazy" />
```

### Dynamic Imports

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

### Suspense

```tsx
import { Suspense } from 'react';

<Suspense fallback={<ProductsSkeleton />}>
  <ProductList />
</Suspense>
```

---

## Debugging

### React DevTools
- Extensión en navegador
- Ver component tree, props, state

### Console

```tsx
console.log('Products:', products);
console.table(cart.items);

// Debugging renders
useEffect(() => {
  console.log('Component updated', { props, state });
});
```

---

## Solución de Problemas

### Hydration mismatch

```tsx
<html suppressHydrationWarning>
```

### localStorage is not defined

```tsx
'use client';

const [data, setData] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('key');
  }
  return null;
});
```

### Tailwind no aplica

```bash
# Verificar globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

npm run dev  # Reiniciar
```

---

## Deployment (Vercel)

```bash
vercel --prod

# O desde GitHub
# Auto-deploy en cada push
```

**Environment Variables en Vercel**:
```
NEXT_PUBLIC_API_URL = https://api.mitienda.com/api
NEXT_PUBLIC_STORE_URL = mi-tienda-online
```

---

## Scripts

```bash
npm run dev    # Dev server
npm run build  # Build producción
npm start      # Producción
npm run lint   # ESLint
```

---

## Mejores Prácticas

### Performance
- Server Components por defecto
- Client solo cuando necesario
- Image optimization
- Lazy loading

### SEO
- Metadata API por página
- Semantic HTML
- Alt text en imágenes

### Accessibility
- Keyboard navigation
- ARIA labels
- Focus management

### TypeScript
- Types explícitos
- Evitar `any`
- Interfaces para props

---

## Recursos

- [Next.js](https://nextjs.org/docs)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

---

**Última actualización**: 2025-10-15
