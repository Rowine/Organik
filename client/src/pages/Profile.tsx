import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import { getUserDetails } from "../features/userDetailsSlice";
import { updateUserProfile } from "../features/userUpdateProfileSlice";
import { listMyOrders } from "../features/orderListMySlice";
import { IUser } from "../interfaces/IUserLoginState";
import { useFormState, validators } from "../hooks/useFormState";
import { getPasswordStrength } from "../utils/passwordUtils";

export function format(inputDate: string) {
  var dob = new Date(inputDate);
  var dobArr = dob.toDateString().split(" ");
  var dobFormat = dobArr[1] + " " + dobArr[2] + " " + dobArr[3];
  return dobFormat;
}

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userDetails = useAppSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useAppSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderListMy = useAppSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  const userUpdateProfile = useAppSelector((state) => state.userUpdateProfile);
  const { loading: updateLoading } = userUpdateProfile;

  const {
    values,
    hasFieldError,
    getFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    setValue,
  } = useFormState({
    name: {
      initialValue: "",
      required: true,
      validate: validators.minLength(2, "Name must be at least 2 characters"),
    },
    email: {
      initialValue: "",
      required: true,
      validate: validators.email("Please enter a valid email address"),
    },
    password: {
      initialValue: "",
      required: false,
      validate: (value: string) => {
        if (value && value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return null;
      },
    },
    confirmPassword: {
      initialValue: "",
      required: false,
      validate: (value: string) => {
        if (values.password && !value) {
          return "Confirm password is required";
        }
        if (values.password && value !== values.password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      }
    }
  }, [userInfo, user, navigate, dispatch]);

  // Set initial form values only when user data is first loaded
  useEffect(() => {
    if (user.name && user.email && values.name === "" && values.email === "") {
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user.name, user.email, values.name, values.email, setValue]);

  const handleUpdateProfile = async (values: Record<string, any>) => {
    dispatch(
      updateUserProfile({
        _id: user._id,
        name: values.name,
        email: values.email,
        password: values.password,
      } as IUser)
    );
  };

  const passwordStrength = getPasswordStrength(values.password);

  return (
    <main className="flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 lg:gap-x-12">
          {/* Profile Update Section - Desktop */}
          <div className="hidden sm:block lg:col-span-4">
            <div className="sticky top-8">
              <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-400">
                    <UserIcon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Profile Settings
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Update your account information
                  </p>
                </div>

                {error && (
                  <Message type="error">
                    {error.code === "UNAUTHORIZED"
                      ? "You need to login"
                      : error.code === "ACCESS_FORBIDDEN"
                      ? "You do not have permission"
                      : error.message + ". Please try again later."}
                  </Message>
                )}
                {loading === "pending" && <Loader />}
                {updateLoading === "succeeded" && (
                  <Message type="success">Profile Updated Successfully</Message>
                )}

                <form
                  className="space-y-6"
                  onSubmit={handleSubmit(handleUpdateProfile)}
                >
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={values.name}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                          hasFieldError("name")
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        }`}
                        placeholder="Enter your full name"
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                      />
                      {hasFieldError("name") && (
                        <p className="mt-1 text-sm text-red-600">
                          {getFieldError("name")?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                          hasFieldError("email")
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        }`}
                        placeholder="Enter your email"
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                      />
                      {hasFieldError("email") && (
                        <p className="mt-1 text-sm text-red-600">
                          {getFieldError("email")?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                          hasFieldError("password")
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        }`}
                        placeholder="Leave blank to keep current password"
                        value={values.password}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                      />
                      {hasFieldError("password") && (
                        <p className="mt-1 text-sm text-red-600">
                          {getFieldError("password")?.message}
                        </p>
                      )}

                      {/* Password Strength Indicator */}
                      {values.password && (
                        <div className="mt-2">
                          <div className="mb-1 flex justify-between text-xs text-gray-600">
                            <span>Password strength</span>
                            <span
                              className={`font-medium ${
                                passwordStrength.strength === 1
                                  ? "text-red-500"
                                  : passwordStrength.strength === 2
                                  ? "text-yellow-500"
                                  : passwordStrength.strength === 3
                                  ? "text-blue-500"
                                  : "text-green-500"
                              }`}
                            >
                              {passwordStrength.text}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: passwordStrength.width }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required={values.password ? true : false}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                          hasFieldError("confirmPassword")
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        }`}
                        placeholder="Confirm your new password"
                        value={values.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                      />
                      {hasFieldError("confirmPassword") && (
                        <p className="mt-1 text-sm text-red-600">
                          {getFieldError("confirmPassword")?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <span>
                      {isSubmitting ? "Updating Profile..." : "Update Profile"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Order History
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Track your orders and view purchase history
                </p>
              </div>

              {loadingOrders === "pending" ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <Loader />
                </div>
              ) : errorOrders ? (
                <Message type="error">
                  {errorOrders.message + ". Please try again later."}
                </Message>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <ClockIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No orders yet
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Start shopping to see your orders here
                  </p>
                  <Link to="/">
                    <button className="inline-flex items-center rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-gray-200 p-6 transition-shadow hover:shadow-lg"
                    >
                      <div className="space-y-4">
                        {/* Top Row - Order Info */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Order ID
                            </p>
                            <p className="truncate text-sm font-medium text-gray-900">
                              {order._id.slice(-8)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Date
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {format(order.createdAt.substring(0, 10))}
                            </p>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Total
                            </p>
                            <p className="text-sm font-bold text-green-600">
                              ₱{order.totalPrice}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row - Status and Action */}
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                          <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                              Status
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center space-x-1">
                                {order.isPaid ? (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XMarkIcon className="h-4 w-4 text-red-500" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    order.isPaid
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {order.isPaid ? "Paid" : "Unpaid"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {order.isDelivered ? (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ClockIcon className="h-4 w-4 text-yellow-500" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    order.isDelivered
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                  }`}
                                >
                                  {order.isDelivered
                                    ? "Delivered"
                                    : "Processing"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Link to={`/order/${order._id}`}>
                              <button className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Profile Update */}
          <div className="mb-8 lg:hidden">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    <UserIcon className="h-5 w-5" />
                    <span>Update Profile</span>
                    {open ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-4">
                    <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
                      <div className="mb-6 text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-400">
                          <UserIcon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Profile Settings
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Update your account information
                        </p>
                      </div>

                      {error && (
                        <Message type="error">
                          {error.code === "UNAUTHORIZED"
                            ? "You need to login"
                            : error.code === "ACCESS_FORBIDDEN"
                            ? "You do not have permission"
                            : error.message + ". Please try again later."}
                        </Message>
                      )}
                      {loading === "pending" && <Loader />}
                      {updateLoading === "succeeded" && (
                        <Message type="success">
                          Profile Updated Successfully
                        </Message>
                      )}

                      <form
                        className="space-y-5"
                        onSubmit={handleSubmit(handleUpdateProfile)}
                      >
                        <div>
                          <label
                            htmlFor="mobile-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <input
                            id="mobile-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={values.name}
                            className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                              hasFieldError("name")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                            }`}
                            placeholder="Enter your full name"
                            onChange={handleChange("name")}
                            onBlur={handleBlur("name")}
                          />
                          {hasFieldError("name") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("name")?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="mobile-email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <input
                            id="mobile-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={values.email}
                            className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                              hasFieldError("email")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                            }`}
                            placeholder="Enter your email"
                            onChange={handleChange("email")}
                            onBlur={handleBlur("email")}
                          />
                          {hasFieldError("email") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("email")?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="mobile-password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            New Password
                          </label>
                          <input
                            id="mobile-password"
                            name="password"
                            type="password"
                            className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                              hasFieldError("password")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                            }`}
                            placeholder="Leave blank to keep current password"
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                          />
                          {hasFieldError("password") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("password")?.message}
                            </p>
                          )}

                          {/* Password Strength Indicator */}
                          {values.password && (
                            <div className="mt-2">
                              <div className="mb-1 flex justify-between text-xs text-gray-600">
                                <span>Password strength</span>
                                <span
                                  className={`font-medium ${
                                    passwordStrength.strength === 1
                                      ? "text-red-500"
                                      : passwordStrength.strength === 2
                                      ? "text-yellow-500"
                                      : passwordStrength.strength === 3
                                      ? "text-blue-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  {passwordStrength.text}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{ width: passwordStrength.width }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="mobile-confirm-password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <input
                            id="mobile-confirm-password"
                            name="confirm-password"
                            type="password"
                            required={values.password ? true : false}
                            className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                              hasFieldError("confirmPassword")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                            }`}
                            placeholder="Confirm your new password"
                            value={values.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            onBlur={handleBlur("confirmPassword")}
                          />
                          {hasFieldError("confirmPassword") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("confirmPassword")?.message}
                            </p>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          <span>
                            {isSubmitting
                              ? "Updating Profile..."
                              : "Update Profile"}
                          </span>
                        </button>
                      </form>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
