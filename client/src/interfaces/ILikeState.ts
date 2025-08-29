import { ApiError } from "../types/errors";

interface ILikeItems {
  _id: string;
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export default interface ILikeState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  likeItems: ILikeItems[];
  error: ApiError | undefined;
}
