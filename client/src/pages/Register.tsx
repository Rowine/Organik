import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { register } from "../features/userRegisterSlice";
import { useFormState, validators } from "../hooks/useFormState";
import { getPasswordStrength } from "../utils/passwordUtils";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const userRegister = useAppSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const {
    values,
    hasFieldError,
    getFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
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
      required: true,
      validate: validators.minLength(
        6,
        "Password must be at least 6 characters"
      ),
    },
    confirmPassword: {
      initialValue: "",
      required: false,
      validate: (value: string) => {
        if (!value) {
          return "Confirm password is required";
        }
        const password = values.password;
        if (value !== password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleRegister = async (values: Record<string, any>) => {
    dispatch(
      register({
        name: values.name.trim(),
        email: values.email,
        password: values.password,
      })
    );
  };

  const passwordStrength = getPasswordStrength(values.password);

  return (
    <>
      <main className="flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Create Account
                </h2>
                <p className="mt-4 text-base text-gray-600 sm:text-lg">
                  Join us and start shopping fresh
                </p>
              </div>

              {error && (
                <Message type="error">
                  {error.message + ". Please try again later."}
                </Message>
              )}

              {loading === "pending" ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="mt-8">
                  <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
                    <form
                      className="space-y-6"
                      onSubmit={handleSubmit(handleRegister)}
                    >
                      <div className="space-y-5">
                        {/* Personal Information Section */}
                        <div className="border-b border-gray-100 pb-4">
                          <h3 className="mb-4 text-sm font-medium text-gray-700">
                            Personal Information
                          </h3>

                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Full Name *
                            </label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              required
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                                hasFieldError("name")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                              }`}
                              placeholder="Enter your full name"
                              value={values.name}
                              onChange={handleChange("name")}
                              onBlur={handleBlur("name")}
                            />
                            {hasFieldError("name") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("name")?.message}
                              </p>
                            )}
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor="email-address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email Address *
                            </label>
                            <input
                              id="email-address"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                                hasFieldError("email")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                              }`}
                              placeholder="Enter your email address"
                              value={values.email}
                              onChange={handleChange("email")}
                              onBlur={handleBlur("email")}
                            />
                            {hasFieldError("email") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("email")?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Security Section */}
                        <div>
                          <h3 className="mb-4 text-sm font-medium text-gray-700">
                            Security
                          </h3>

                          <div>
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Password *
                            </label>
                            <input
                              id="password"
                              name="password"
                              type="password"
                              required
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                                hasFieldError("password")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                              }`}
                              placeholder="Create a strong password"
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

                          <div className="mt-4">
                            <label
                              htmlFor="confirm-password"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Confirm Password *
                            </label>
                            <input
                              id="confirm-password"
                              name="confirm-password"
                              type="password"
                              required
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                                hasFieldError("confirmPassword")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                              }`}
                              placeholder="Confirm your password"
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
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          className="flex w-full justify-center rounded-xl bg-green-600 px-8 py-3 text-base font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-lg"
                        >
                          {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to={redirect ? `/login?redirect=${redirect}` : "/login"}
                      className="font-medium text-green-600 transition-colors hover:text-green-500"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
