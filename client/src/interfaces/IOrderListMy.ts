import { IOrderItems } from "./IOrderDetailsState";
import { ApiError } from "../types/errors";

export default interface IOrderListMy {
  loading: "idle" | "pending" | "succeeded" | "failed";
  orders: IOrderItems[];
  error: ApiError | undefined;
}
