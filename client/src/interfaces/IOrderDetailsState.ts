import { ICartItem } from "./ICartState";
import { ApiError } from "../types/errors";

export interface IOrderItems {
  _id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
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
  createdAt: string;
  updatedAt: string;
}

export default interface IOrderDetailsState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  order: IOrderItems;
  error: ApiError | undefined;
}
