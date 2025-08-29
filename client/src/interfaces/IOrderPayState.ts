import { PaymentError } from "../types/errors";

export default interface IOrderPayState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: PaymentError | undefined;
}
