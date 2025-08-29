import IProductItem from "./IProductItem";
import { ApiError } from "../types/errors";

export default interface IProductListState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  products: IProductItem[];
  error?: ApiError;
  lastFetched?: number;
  cacheExpiry: number; // Cache expiry time in milliseconds
  categories: Record<string, IProductItem[]>; // Cached products by category
  isStale: boolean; // Whether the data needs refreshing
}
