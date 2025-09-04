import React, { useState } from "react";
import {
  LoadingState,
  SpinnerLoader,
  SkeletonLoader,
  DotsLoader,
  PulseLoader,
  ShimmerLoader,
  InlineLoader,
  OverlayLoader,
} from "./index";

import {
  ProductCardSkeleton,
  CategorySkeleton,
  ProductDetailsSkeleton,
  ListSkeleton,
} from "./skeletons";
import { useLoadingState, useAsyncLoading } from "../../hooks/useLoadingState";

/**
 * LoadingExamples Component
 *
 * A comprehensive example component that demonstrates all the loading components
 * and their usage patterns. This serves as both documentation and a testing
 * ground for the loading system.
 *
 * This component shows:
 * 1. ✅ All loading variants in action
 * 2. ✅ Different sizes and positions
 * 3. ✅ Specialized skeleton components
 * 4. ✅ Loading state management hooks
 * 5. ✅ Real-world usage patterns
 */
export const LoadingExamples: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  // Example of using the loading state hook
  const { isLoading, startLoading, stopLoading, stopLoadingWithError } =
    useLoadingState();

  // Example of using the async loading hook
  const {
    execute: simulateAsync,
    isLoading: asyncLoading,
    error: asyncError,
  } = useAsyncLoading(
    async (delay: number = 2000) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (Math.random() > 0.7) {
        throw new Error("Simulated error occurred");
      }
      return "Operation completed successfully!";
    },
    {
      onSuccess: (data) => console.log("Success:", data),
      onError: (error) => console.error("Error:", error),
    }
  );

  const handleSimulateLoading = () => {
    startLoading();
    setTimeout(() => {
      if (Math.random() > 0.5) {
        stopLoading();
      } else {
        stopLoadingWithError("Something went wrong!");
      }
    }, 2000);
  };

  const handleSimulateAsync = () => {
    simulateAsync(1500);
  };

  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Loading Components Examples
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive examples of all loading components and their usage
          patterns
        </p>
      </div>

      {/* Basic Loading Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Basic Loading Variants
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Spinner Loader */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Spinner Loader</h3>
            <div className="flex h-32 items-center justify-center">
              <SpinnerLoader isLoading={true} size="md" />
            </div>
          </div>

          {/* Dots Loader */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Dots Loader</h3>
            <div className="flex h-32 items-center justify-center">
              <DotsLoader isLoading={true} size="md" showText={true} />
            </div>
          </div>

          {/* Pulse Loader */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Pulse Loader</h3>
            <div className="flex h-32 items-center justify-center">
              <PulseLoader isLoading={true} size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Skeleton Loaders */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Skeleton Loaders</h2>

        <div className="space-y-8">
          {/* Basic Skeleton */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Basic Skeleton</h3>
            <SkeletonLoader isLoading={true} count={3} height="60px" />
          </div>

          {/* Product Card Skeleton */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Product Card Skeleton
            </h3>
            <ProductCardSkeleton count={4} />
          </div>

          {/* Category Skeleton */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Category Skeleton</h3>
            <CategorySkeleton productCount={6} />
          </div>

          {/* List Skeleton */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">List Skeleton</h3>
            <ListSkeleton count={5} showAvatar={true} showActions={true} />
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Interactive Examples
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Loading State Hook Example */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Loading State Hook</h3>
            <div className="space-y-4">
              <button
                onClick={handleSimulateLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Simulate Loading"}
              </button>
              {isLoading && (
                <div className="flex items-center justify-center">
                  <SpinnerLoader isLoading={true} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Async Loading Hook Example */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Async Loading Hook</h3>
            <div className="space-y-4">
              <button
                onClick={handleSimulateAsync}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                disabled={asyncLoading}
              >
                {asyncLoading ? "Processing..." : "Simulate Async Operation"}
              </button>
              {asyncLoading && (
                <InlineLoader
                  isLoading={true}
                  text="Processing your request..."
                />
              )}
              {asyncError && (
                <div className="text-sm text-red-600">Error: {asyncError}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Size and Position Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Size and Position Examples
        </h2>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Different Sizes</h3>
          <div className="flex items-center space-x-8">
            <SpinnerLoader isLoading={true} size="xs" />
            <SpinnerLoader isLoading={true} size="sm" />
            <SpinnerLoader isLoading={true} size="md" />
            <SpinnerLoader isLoading={true} size="lg" />
            <SpinnerLoader isLoading={true} size="xl" />
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Different Positions</h3>
          <div className="relative h-40 border-2 border-dashed border-gray-300">
            <SpinnerLoader isLoading={true} position="center" />
          </div>
        </div>
      </section>

      {/* Overlay Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Overlay Example</h2>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <button
            onClick={handleShowOverlay}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
          >
            Show Overlay Loading
          </button>
        </div>
      </section>

      {/* Overlay Component */}
      {showOverlay && (
        <OverlayLoader
          isLoading={true}
          message="Processing your request..."
          dismissible={true}
          onDismiss={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
};
