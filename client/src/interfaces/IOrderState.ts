import { ICartItem } from "./ICartState";
import { ApiError } from "../types/errors";

export default interface IOrderState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  order: {
    _id: string;
    user: string;
    orderItems: ICartItem[];
    shippingAddress: {
      address: string;
      city: string;
      postalCode: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: string;
    isDelivered: boolean;
    deliveredAt: string;
  };
  error: ApiError | undefined;
}
