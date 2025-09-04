import React from "react";
import { SkeletonLoader } from "../SkeletonLoader";

/**
 * ProductCardSkeleton Component
 * Usage:
 * <ProductCardSkeleton count={8} />
 */
interface ProductCardSkeletonProps {
  count?: number;
  className?: string;
  animationSpeed?: "slow" | "normal" | "fast";
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  count = 8,
  className = "",
  animationSpeed = "normal",
}) => {
  return (
    <div
      className={`
        grid 
        grid-cols-2 
        gap-x-4 
        gap-y-8 
        sm:gap-x-6 
        sm:gap-y-10 
        md:grid-cols-3 
        md:gap-x-8 
        lg:grid-cols-4 
        xl:gap-x-12
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${count} products`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="group relative rounded-xl p-1 shadow-lg sm:p-3"
          role="img"
          aria-label={`Loading product ${index + 1}`}
        >
          {/* Product Image Skeleton */}
          <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="240px"
              width="100%"
              rounded={false}
              animationSpeed={animationSpeed}
              className="h-full w-full"
            />
          </div>

          {/* Product Info Skeleton */}
          <div className="mt-4 sm:flex sm:justify-between">
            <div className="flex-1">
              {/* Product Name */}
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="20px"
                width="60%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-2"
              />

              {/* Product Category */}
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="16px"
                width="40%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-2"
              />
            </div>

            {/* Product Price */}
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="20px"
              width="35%"
              rounded={true}
              animationSpeed={animationSpeed}
              className="sm:mt-0"
            />
          </div>

          {/* Rating Skeleton */}
          <div className="mt-3 flex items-center space-x-1">
            <SkeletonLoader
              isLoading={true}
              count={5}
              height="16px"
              width="16px"
              rounded={true}
              animationSpeed={animationSpeed}
              className="flex space-x-1"
            />
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="14px"
              width="30%"
              rounded={true}
              animationSpeed={animationSpeed}
              className="ml-2"
            />
          </div>
        </div>
      ))}

      <span className="sr-only">Loading {count} products</span>
    </div>
  );
};
