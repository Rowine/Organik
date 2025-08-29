import { IUser } from "./IUserLoginState";
import { ApiError } from "../types/errors";

export default interface IUserListState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  users: IUser[];
  error: ApiError | undefined;
}
