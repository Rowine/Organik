import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Container from "../components/Container";
import { listProductDetails } from "../features/productDetailsSlice";
import {
  updateProduct,
  resetProductUpdate,
} from "../features/productUpdateSlice";
import IProductItem from "../interfaces/IProductItem";
import { getUserFriendlyMessage } from "../utils/errorUtils";
import { useFormState, validators } from "../hooks/useFormState";

const ProductEdit = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id: productId } = useParams();

  const dispatch = useAppDispatch();
  const productDetails = useAppSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useAppSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const {
    values,
    hasFieldError,
    getFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    setValue,
  } = useFormState({
    name: {
      initialValue: "",
      required: true,
      validate: validators.minLength(
        2,
        "Product name must be at least 2 characters"
      ),
    },
    price: {
      initialValue: 0,
      required: true,
      validate: validators.positive("Price must be greater than 0"),
    },
    image: {
      initialValue: "",
      required: true,
      validate: validators.required("Image URL is required"),
    },
    category: {
      initialValue: "",
      required: true,
      validate: validators.minLength(
        2,
        "Category must be at least 2 characters"
      ),
    },
    countInStock: {
      initialValue: 0,
      required: true,
      validate: validators.numeric("Count in stock must be a valid number"),
    },
  });

  useEffect(() => {
    if (successUpdate) {
      dispatch(resetProductUpdate());
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId as string));
      }
    }
  }, [dispatch, product, productId, successUpdate, navigate]);

  // Set initial form values only when product data is first loaded
  useEffect(() => {
    if (
      product.name &&
      product._id === productId &&
      values.name === "" &&
      values.price === 0
    ) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("image", product.image);
      setValue("category", product.category);
      setValue("countInStock", product.countInStock);
    }
  }, [product, productId, values.name, values.price, setValue]);

  const handleUpdateProduct = async (values: Record<string, any>) => {
    const product = {
      _id: productId,
      name: values.name.trim(),
      price: Number(values.price),
      image: values.image.trim(),
      category: values.category.trim(),
      countInStock: Number(values.countInStock),
    } as IProductItem;
    dispatch(updateProduct(product));
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setUploadError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      const path = "/" + data.split("/").slice(3).join("/");

      setValue("image", path);
      setUploading(false);
      // Clear any previous upload errors on success
    } catch (error: any) {
      console.error(error);
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
      setUploading(false);
    }
  };
  return (
    <Container>
      <div className="ml-4 sm:m-0">
        <Link
          to="/admin/productlist"
          className="group relative my-3 flex w-fit justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Go Back
        </Link>
      </div>
      <div className="mb-5 flex max-h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="my-10 text-center text-4xl font-bold tracking-tight text-gray-900">
              Edit Product
            </h2>
          </div>
          {loadingUpdate === "pending" && <Loader />}
          {errorUpdate && (
            <Message type="error">
              {typeof errorUpdate === "string"
                ? errorUpdate
                : getUserFriendlyMessage(errorUpdate)}
              . Please try again later.
            </Message>
          )}
          {loading === "pending" ? (
            <Loader />
          ) : error ? (
            <Message type="error">
              {error.code === "UNAUTHORIZED"
                ? "You need to login"
                : error.code === "ACCESS_FORBIDDEN"
                ? "You do not have permission"
                : getUserFriendlyMessage(error) + ". Please try again later."}
            </Message>
          ) : (
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleUpdateProduct)}
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="space-y-4 shadow-sm">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("name")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-600 focus:ring-green-200"
                    }`}
                    placeholder="Enter Name"
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {hasFieldError("name") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("name")?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    autoComplete="price"
                    min="0"
                    value={values.price}
                    step="any"
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("price")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-600 focus:ring-green-200"
                    }`}
                    placeholder="Enter Price"
                    onChange={handleChange("price")}
                    onBlur={handleBlur("price")}
                  />
                  {hasFieldError("price") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("price")?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="image">Image</label>
                  <input
                    id="image"
                    name="image"
                    type="text"
                    autoComplete="image"
                    value={values.image}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("image")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-600 focus:ring-green-200"
                    }`}
                    placeholder="Enter Image Url"
                    onChange={handleChange("image")}
                    onBlur={handleBlur("image")}
                  />
                  {hasFieldError("image") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("image")?.message}
                    </p>
                  )}
                  <input
                    type="file"
                    id="image-file"
                    onChange={uploadFileHandler}
                    className="relative mt-2 block w-full appearance-none text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm"
                  />
                  {uploading && <Loader />}
                  {uploadError && <Message type="error">{uploadError}</Message>}
                </div>
                <div>
                  <label htmlFor="countInStock">Count In Stock</label>
                  <input
                    id="countInStock"
                    name="countInStock"
                    type="number"
                    autoComplete="countInStock"
                    min={0}
                    value={values.countInStock}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("countInStock")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-600 focus:ring-green-200"
                    }`}
                    placeholder="Enter Count In Stock"
                    onChange={handleChange("countInStock")}
                    onBlur={handleBlur("countInStock")}
                  />
                  {hasFieldError("countInStock") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("countInStock")?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    autoComplete="category"
                    value={values.category}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("category")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-600 focus:ring-green-200"
                    }`}
                    placeholder="Enter Category"
                    onChange={handleChange("category")}
                    onBlur={handleBlur("category")}
                  />
                  {hasFieldError("category") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("category")?.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductEdit;
