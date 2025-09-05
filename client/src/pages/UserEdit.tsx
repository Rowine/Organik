import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails } from "../features/userDetailsSlice";
import { updateUser } from "../features/userUpdateSlice";
import { resetUpdateProfile } from "../features/userUpdateSlice";
import Container from "../components/Container";
import { IUser } from "../interfaces/IUserLoginState";
import { getUserFriendlyMessage } from "../utils/errorUtils";
import { useFormState, validators } from "../hooks/useFormState";

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useAppSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate } = userUpdate;

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
    isAdmin: {
      initialValue: false,
      required: false,
      validate: () => null, // No validation needed for checkbox
    },
  });

  useEffect(() => {
    if (loadingUpdate === "succeeded") {
      dispatch(resetUpdateProfile());
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== id) {
        dispatch(getUserDetails(id as string));
      }
    }
  }, [dispatch, user, id, loadingUpdate, navigate]);

  // Set initial form values only when user data is first loaded
  useEffect(() => {
    if (
      user.name &&
      user._id === id &&
      values.name === "" &&
      values.email === ""
    ) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("isAdmin", user.isAdmin);
    }
  }, [user, id, values.name, values.email, setValue]);

  const handleUpdateUser = async (values: Record<string, any>) => {
    const userData = {
      _id: id,
      name: values.name.trim(),
      email: values.email.trim(),
      isAdmin: values.isAdmin,
    } as IUser;

    // Only include password if it's provided
    if (values.password && values.password.trim()) {
      (userData as any).password = values.password.trim();
    }

    dispatch(updateUser(userData));
  };
  return (
    <Container>
      <div className="mt-4">
        <Link
          to="/admin/userlist"
          className="text-xl font-medium text-green-500 hover:text-green-700"
        >
          Go Back
        </Link>
      </div>
      <div className="h-50 flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="my-16 text-center text-4xl font-bold tracking-tight text-gray-900">
              Edit User
            </h2>
          </div>
          {loadingUpdate === "pending" && <Loader />}
          {errorUpdate && (
            <Message type="error">
              {typeof errorUpdate === "string"
                ? errorUpdate
                : getUserFriendlyMessage(errorUpdate)}
              . Please try again later.
            </Message>
          )}
          {loading === "pending" ? (
            <Loader />
          ) : error ? (
            <Message type="error">
              {error.code === "UNAUTHORIZED"
                ? "You need to login"
                : error.code === "ACCESS_FORBIDDEN"
                ? "You do not have permission"
                : getUserFriendlyMessage(error) + ". Please try again later."}
            </Message>
          ) : (
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleUpdateUser)}
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="space-y-4 shadow-sm">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("name")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                    }`}
                    placeholder="Enter Name"
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
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("email")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                    }`}
                    placeholder="Email address"
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
                    Password (optional)
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={values.password}
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${
                      hasFieldError("password")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                    }`}
                    placeholder="Enter new password (leave blank to keep current)"
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  {hasFieldError("password") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("password")?.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    id="is-admin"
                    name="is-admin"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={values.isAdmin}
                    onChange={(e) => setValue("isAdmin", e.target.checked)}
                  />
                  <label
                    htmlFor="is-admin"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Is Admin
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
};

export default UserEdit;
