import IProductItem from "./IProductItem";
import { ApiError } from "../types/errors";

export default interface IProductDetailsState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  product: IProductItem;
  error: ApiError | undefined;
}
