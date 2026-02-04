"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductSkeletonProps {
  count?: number
}

export function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card 
          key={i} 
          className="overflow-hidden"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-muted relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Category */}
            <div className="h-3 w-16 bg-muted rounded skeleton-shimmer" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded skeleton-shimmer" />
              <div className="h-4 w-2/3 bg-muted rounded skeleton-shimmer" />
            </div>
            
            {/* Description */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-muted rounded skeleton-shimmer" />
              <div className="h-3 w-4/5 bg-muted rounded skeleton-shimmer" />
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 w-24 bg-muted rounded skeleton-shimmer" />
              <div className="h-3 w-16 bg-muted rounded skeleton-shimmer" />
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <div className="h-10 w-full bg-muted rounded skeleton-shimmer" />
          </CardFooter>
        </Card>
      ))}
      
      <style jsx global>{`
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative h-[600px] overflow-hidden bg-muted">
      <div className="absolute inset-0 skeleton-shimmer" />
      <div className="container relative mx-auto flex h-full items-center px-4">
        <div className="max-w-2xl space-y-6">
          <div className="h-16 w-3/4 bg-background/20 rounded skeleton-shimmer" />
          <div className="h-6 w-2/3 bg-background/20 rounded skeleton-shimmer" />
          <div className="h-12 w-40 bg-background/20 rounded skeleton-shimmer" />
        </div>
      </div>
    </section>
  )
}
