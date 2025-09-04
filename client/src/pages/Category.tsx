import React from "react";
import { Link, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Meta from "../components/Meta";
import IProductItem from "../interfaces/IProductItem";
import { useProducts } from "../hooks/useProducts";
import { getUserFriendlyMessage } from "../utils/errorUtils";
import ProductCard from "../components/ProductCard";
import { CategorySkeleton } from "../components/loading/skeletons";

const Category = () => {
  const { category } = useParams();

  // Use the enhanced products hook with category filtering
  const {
    products: categoryProducts,
    isLoading,
    isInitialLoading,
    error,
    isStale,
    refetch,
  } = useProducts({
    category,
    enableBackgroundRefresh: true,
  });

  const metaCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Category";

  const CategoryHeader = () => (
    <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-10 text-center shadow-2xl">
      {/* Background image with overlay */}
      <img
        src="/images/banner/bg-leaf.jpg"
        alt="Organic leaf pattern"
        className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-700/80" />

      <div className="relative z-10">
        <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/20 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
          Fresh & Organic
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
          {metaCategory}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 drop-shadow-md">
          Discover our premium selection of fresh {category?.toLowerCase()}{" "}
          sourced directly from local farms
        </p>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
      <div className="absolute top-1/2 left-1/4 h-20 w-20 -translate-y-1/2 transform rounded-full bg-white/5 blur-lg" />
    </div>
  );

  const EmptyState = () => (
    <div className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        No products found
      </h3>
      <p className="mb-8 text-gray-600">
        We're currently updating our {category} selection. Check back soon!
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-500"
      >
        Browse All Products
      </Link>
    </div>
  );

  return (
    <>
      <Meta title={`Organik | ${metaCategory}`} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CategoryHeader />

          {isInitialLoading ? (
            <CategorySkeleton productCount={8} />
          ) : error ? (
            <div className="mb-8">
              <Message type="error">
                {typeof error === "string"
                  ? error + ". Please try again later."
                  : error.code === "UNAUTHORIZED"
                  ? "You need to login"
                  : error.code === "ACCESS_FORBIDDEN"
                  ? "You do not have permission"
                  : error.code === "NOT_FOUND"
                  ? "Category not found"
                  : getUserFriendlyMessage(error) + ". Please try again later."}
              </Message>
            </div>
          ) : categoryProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Fresh {metaCategory}
                  </h2>
                  <div className="mt-1 flex items-center gap-4">
                    <p className="text-gray-600">
                      {categoryProducts.length} product
                      {categoryProducts.length !== 1 ? "s" : ""} available
                    </p>
                    {isStale && (
                      <button
                        onClick={refetch}
                        className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Refresh
                      </button>
                    )}
                  </div>
                </div>
                <div className="hidden items-center space-x-4 sm:flex">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Customer Rating</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4 xl:gap-x-12">
                {categoryProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Call to action section */}
              <div className="mt-16 rounded-3xl bg-green-50 px-8 py-12 text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Can't find what you're looking for?
                </h3>
                <p className="mx-auto mb-6 max-w-2xl text-gray-600">
                  Our team is always adding new products. Contact us to request
                  specific items or get notified when new {category} arrive.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-500">
                    Contact Us
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
