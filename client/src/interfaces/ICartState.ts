import { CartError, ResourceError } from "../types/errors";

export interface ICartItem {
  _id: string;
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export default interface ICartState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  cartItems: ICartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  error: CartError | ResourceError | undefined;
}
