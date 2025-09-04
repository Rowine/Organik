import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import IProductItem, { IReview } from "../interfaces/IProductItem";
import { IParams } from "../interfaces/IParams";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { listProductDetails } from "../features/productDetailsSlice";
import { createProductReview } from "../features/productCreateReviewSlice";
import { resetProductCreateReview } from "../features/productCreateReviewSlice";
import Message from "../components/Message";
import Meta from "../components/Meta";
import {
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { getUserFriendlyMessage } from "../utils/errorUtils";
import { InlineLoader } from "../components/loading";
import { ProductDetailsSkeleton } from "../components/loading/skeletons";

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useAppDispatch();
  const productDetails = useAppSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productCreateReview = useAppSelector(
    (state) => state.productCreateReview
  );
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productCreateReview;

  const { userInfo } = useAppSelector((state) => state.userLogin);

  const { likeItems } = useAppSelector((state) => state.like);

  const { id: productId } = useParams<keyof IParams>() as IParams;

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted!");
      setRating(0);
      setComment("");
      dispatch(resetProductCreateReview());
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, successProductReview]);

  const navigate = useNavigate();

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`);
  };

  const addToLikeHandler = () => {
    navigate(`/like/${productId}?qty=${qty}`);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const review = {
      name: userInfo?.name,
      rating,
      comment,
    } as IReview;
    dispatch(createProductReview({ productId, review }));
    setRating(0);
    setComment("");
  };

  const ReviewCard = ({ review }: { review: IReview }) => (
    <div className="mb-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <span className="text-sm font-semibold text-green-600">
              {review.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.name}</p>
            <p className="text-sm text-gray-500">
              {review.createdAt.substring(0, 10)}
            </p>
          </div>
        </div>
        <Rating value={review.rating} />
      </div>
      <p className="leading-relaxed text-gray-700">{review.comment}</p>
    </div>
  );

  return (
    <>
      <Meta title={product.name} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading === "pending" ? (
            <ProductDetailsSkeleton />
          ) : error ? (
            <div className="mb-8">
              <Message type="error">
                {error.code === "UNAUTHORIZED"
                  ? "You need to login"
                  : error.code === "ACCESS_FORBIDDEN"
                  ? "You do not have permission"
                  : error.code === "NOT_FOUND"
                  ? "Product not found"
                  : getUserFriendlyMessage(error) + ". Please try again later."}
              </Message>
            </div>
          ) : (
            <>
              {/* Product Details Section */}
              <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Side - Product Image */}
                <div className="space-y-6">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-3xl bg-white shadow-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain object-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Product Details and Actions */}
                <div className="flex flex-col">
                  <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
                    {/* Product Info */}
                    <div className="mb-6">
                      <div className="mb-4 flex items-center space-x-2">
                        <Rating value={product.rating} />
                        <span className="text-sm text-gray-500">
                          ({product.numReviews} reviews)
                        </span>
                      </div>
                      <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {product.name}
                      </h1>
                      <p className="mb-6 text-3xl font-bold text-green-600">
                        ₱{product.price}
                      </p>
                    </div>

                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Product Details
                    </h3>
                    <p className="mb-6 leading-relaxed text-gray-700">
                      Fresh, organic produce sourced directly from local farms.
                      This premium quality{" "}
                      {product.category?.toLowerCase() || "product"} is
                      carefully selected to ensure the best taste and
                      nutritional value.
                    </p>

                    <div className="mb-6 flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">
                        Availability:
                      </span>
                      {product.countInStock > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          In Stock ({product.countInStock} available)
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {product.countInStock > 0 && (
                      <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <select
                          className="w-32 rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[
                            ...Array(Math.min(product.countInStock, 10)).keys(),
                          ].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        className={`flex flex-1 items-center justify-center space-x-2 rounded-xl py-4 px-6 font-medium transition-all ${
                          product.countInStock === 0
                            ? "cursor-not-allowed bg-gray-300 text-gray-500"
                            : "bg-green-600 text-white hover:bg-green-500 hover:shadow-lg"
                        }`}
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>
                          {product.countInStock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </span>
                      </button>

                      <button
                        className={`flex items-center justify-center rounded-xl py-4 px-6 transition-all ${
                          product.countInStock === 0
                            ? "cursor-not-allowed bg-gray-300 text-gray-500"
                            : "bg-pink-600 text-white hover:bg-pink-500 hover:shadow-lg"
                        }`}
                        disabled={product.countInStock === 0}
                        onClick={addToLikeHandler}
                      >
                        {likeItems.find(
                          (likeItem) => likeItem.product === product._id
                        ) ? (
                          <HeartSolidIcon className="h-6 w-6" />
                        ) : (
                          <HeartIcon className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews and Write Review Section */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Reviews */}
                <div className="lg:col-span-2">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Customer Reviews
                    </h2>
                    <span className="text-sm text-gray-500">
                      {product.reviews.length} review
                      {product.reviews.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {product.reviews.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <StarIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to share your thoughts about this product.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Write Review */}
                <div>
                  <div className="sticky top-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      Write a Review
                    </h3>

                    {successProductReview && (
                      <Message type="success">
                        Review submitted successfully
                      </Message>
                    )}
                    {loadingProductReview === "pending" && (
                      <InlineLoader
                        isLoading={true}
                        text="Submitting review..."
                      />
                    )}
                    {errorProductReview && (
                      <Message type="error">
                        {typeof errorProductReview === "string"
                          ? errorProductReview
                          : getUserFriendlyMessage(errorProductReview)}
                        . Please try again later.
                      </Message>
                    )}

                    {userInfo ? (
                      <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                          <label
                            htmlFor="rating"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Rating
                          </label>
                          <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select rating...</option>
                            <option value="1">⭐ 1 - Poor</option>
                            <option value="2">⭐⭐ 2 - Fair</option>
                            <option value="3">⭐⭐⭐ 3 - Good</option>
                            <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="comment"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Your Review
                          </label>
                          <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Share your experience with this product..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-green-600 py-3 px-4 font-medium text-white transition-colors hover:bg-green-500"
                        >
                          Submit Review
                        </button>
                      </form>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="mb-4 text-gray-600">
                          Sign in to write a review
                        </p>
                        <Link
                          to="/login"
                          className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-500"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
