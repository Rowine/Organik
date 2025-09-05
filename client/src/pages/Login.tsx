import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { login } from "../features/userLoginSlice";
import { getUserFriendlyMessage } from "../types/errors";
import { useFormState, validators } from "../hooks/useFormState";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const userLogin = useAppSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

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
  });

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleLogin = async (values: Record<string, any>) => {
    dispatch(login({ email: values.email, password: values.password }));
  };

  return (
    <>
      <main className="flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Welcome Back
                </h2>
                <p className="mt-4 text-base text-gray-600 sm:text-lg">
                  Sign in to your account
                </p>
              </div>

              {error && (
                <Message type="error">{getUserFriendlyMessage(error)}</Message>
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
                      onSubmit={handleSubmit(handleLogin)}
                    >
                      <div className="space-y-5">
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
                            required
                            className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                              hasFieldError("email")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                            }`}
                            placeholder="Enter your email"
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
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
                              hasFieldError("password")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                            }`}
                            placeholder="Enter your password"
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                          />
                          {hasFieldError("password") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("password")?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-green-600 transition-colors focus:ring-green-500"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Remember me
                          </label>
                        </div>

                        <div className="text-sm">
                          <Link
                            to={
                              redirect
                                ? `/register?redirect=${redirect}`
                                : "/register"
                            }
                            className="font-medium text-green-600 transition-colors hover:text-green-500"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          className="flex w-full justify-center rounded-xl bg-green-600 px-8 py-3 text-base font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-lg"
                        >
                          {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to={
                        redirect
                          ? `/register?redirect=${redirect}`
                          : "/register"
                      }
                      className="font-medium text-green-600 transition-colors hover:text-green-500"
                    >
                      Sign up for free
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

export default Login;
