import React from "react";
import { SkeletonLoader } from "../SkeletonLoader";

interface ProductDetailsSkeletonProps {
  className?: string;
  animationSpeed?: "slow" | "normal" | "fast";
}

export const ProductDetailsSkeleton: React.FC<ProductDetailsSkeletonProps> = ({
  className = "",
  animationSpeed = "normal",
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Product Details Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Side - Product Image */}
        <div className="space-y-6">
          <div className="relative">
            <div className="aspect-w-4 aspect-h-1 overflow-hidden rounded-3xl bg-white shadow-2xl">
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="400px"
                width="100%"
                rounded={false}
                animationSpeed={animationSpeed}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="flex flex-col">
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
            {/* Rating and Reviews */}
            <div className="mb-6">
              <div className="mb-4 flex items-center space-x-2">
                <SkeletonLoader
                  isLoading={true}
                  count={5}
                  height="20px"
                  width="20px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                  className="flex space-x-1"
                />
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="16px"
                  width="120px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              </div>

              {/* Product Name */}
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="32px"
                width="80%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-4"
              />

              {/* Product Price */}
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="36px"
                width="40%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-6"
              />
            </div>

            {/* Product Details */}
            <div className="mb-6">
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="24px"
                width="50%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-4"
              />
              <SkeletonLoader
                isLoading={true}
                count={3}
                height="16px"
                width="100%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="space-y-2"
              />
            </div>

            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="16px"
                  width="100px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="24px"
                  width="150px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="16px"
                width="80px"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-2"
              />
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="48px"
                width="128px"
                rounded={true}
                animationSpeed={animationSpeed}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="56px"
                width="70%"
                rounded={true}
                animationSpeed={animationSpeed}
              />
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="56px"
                width="56px"
                rounded={true}
                animationSpeed={animationSpeed}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="32px"
              width="200px"
              rounded={true}
              animationSpeed={animationSpeed}
            />
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="16px"
              width="100px"
              rounded={true}
              animationSpeed={animationSpeed}
            />
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SkeletonLoader
                      isLoading={true}
                      count={1}
                      height="40px"
                      width="40px"
                      rounded={true}
                      animationSpeed={animationSpeed}
                    />
                    <div>
                      <SkeletonLoader
                        isLoading={true}
                        count={1}
                        height="16px"
                        width="100px"
                        rounded={true}
                        animationSpeed={animationSpeed}
                        className="mb-1"
                      />
                      <SkeletonLoader
                        isLoading={true}
                        count={1}
                        height="14px"
                        width="80px"
                        rounded={true}
                        animationSpeed={animationSpeed}
                      />
                    </div>
                  </div>
                  <SkeletonLoader
                    isLoading={true}
                    count={5}
                    height="16px"
                    width="16px"
                    rounded={true}
                    animationSpeed={animationSpeed}
                    className="flex space-x-1"
                  />
                </div>
                <SkeletonLoader
                  isLoading={true}
                  count={2}
                  height="16px"
                  width="100%"
                  rounded={true}
                  animationSpeed={animationSpeed}
                  className="space-y-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Form */}
        <div>
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
            <SkeletonLoader
              isLoading={true}
              count={1}
              height="24px"
              width="60%"
              rounded={true}
              animationSpeed={animationSpeed}
              className="mb-4"
            />

            <div className="space-y-4">
              <div>
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="16px"
                  width="50px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                  className="mb-2"
                />
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="48px"
                  width="100%"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              </div>

              <div>
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="16px"
                  width="80px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                  className="mb-2"
                />
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="96px"
                  width="100%"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              </div>

              <SkeletonLoader
                isLoading={true}
                count={1}
                height="48px"
                width="100%"
                rounded={true}
                animationSpeed={animationSpeed}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
