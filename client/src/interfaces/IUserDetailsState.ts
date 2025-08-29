import { IUser } from "./IUserLoginState";
import { ApiError } from "../types/errors";

export default interface IUserDetailsState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  user: IUser;
  error: ApiError | undefined;
}
