import React from "react";
import { SkeletonLoader } from "../SkeletonLoader";

interface CategorySkeletonProps {
  productCount?: number;
  className?: string;
  animationSpeed?: "slow" | "normal" | "fast";
}

export const CategorySkeleton: React.FC<CategorySkeletonProps> = ({
  productCount = 8,
  className = "",
  animationSpeed = "normal",
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Category Info Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <SkeletonLoader
            isLoading={true}
            count={1}
            height="32px"
            width="200px"
            rounded={true}
            animationSpeed={animationSpeed}
            className="mb-2"
          />
          <div className="flex items-center gap-4">
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="16px"
              width="150px"
              rounded={true}
              animationSpeed={animationSpeed}
            />
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="16px"
              width="80px"
              rounded={true}
              animationSpeed={animationSpeed}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="hidden items-center space-x-4 sm:flex">
          <SkeletonLoader
            isLoading={true}
            count={1}
            height="16px"
            width="60px"
            rounded={true}
            animationSpeed={animationSpeed}
          />
          <SkeletonLoader
            isLoading={true}
            count={1}
            height="40px"
            width="180px"
            rounded={true}
            animationSpeed={animationSpeed}
          />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4 xl:gap-x-12">
        {Array.from({ length: productCount }, (_, index) => (
          <div
            key={index}
            className="group relative rounded-xl p-1 shadow-lg sm:p-3"
            role="img"
            aria-label={`Loading product ${index + 1}`}
          >
            {/* Product Image */}
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

            {/* Product Info */}
            <div className="mt-4 sm:flex sm:justify-between">
              <div className="flex-1">
                {/* Product Name */}
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="20px"
                  width="70%"
                  rounded={true}
                  animationSpeed={animationSpeed}
                  className="mb-2"
                />

                {/* Product Category */}
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="16px"
                  width="50%"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              </div>

              {/* Product Price */}
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="20px"
                width="40%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="sm:mt-0"
              />
            </div>

            {/* Rating */}
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
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 rounded-3xl bg-gray-100 px-8 py-12 text-center">
        <SkeletonLoader
          isLoading={true}
          count={1}
          height="32px"
          width="400px"
          rounded={true}
          animationSpeed={animationSpeed}
          className="mx-auto mb-4"
        />
        <SkeletonLoader
          isLoading={true}
          count={2}
          height="20px"
          width="600px"
          rounded={true}
          animationSpeed={animationSpeed}
          className="mx-auto mb-6 space-y-2"
        />
        <SkeletonLoader
          isLoading={true}
          count={1}
          height="48px"
          width="150px"
          rounded={true}
          animationSpeed={animationSpeed}
          className="mx-auto"
        />
      </div>
    </div>
  );
};
