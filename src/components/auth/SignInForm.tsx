import { useState, useEffect } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

import { login, LoginPayload } from "../../api/auth";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_API_BASE_URL;

export default function SignInForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"starting" | "online">(
    "starting"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    toast.custom(
      (t) => (
        <div
          className={`relative max-w-md w-full bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-lg transition-opacity duration-300 ${
            t.visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="absolute top-3 right-3 text-black/40 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Message */}
          <p className="text-base leading-relaxed pr-6">
            <strong>Note:</strong> The backend is hosted on a free service. If it has
            been idle, it may take up to 60 seconds or more to wake up. After that,
            all requests will respond normally.
          </p>
        </div>
      ),
      {
        duration: Infinity,
      }
    );

    const checkBackend = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/ping`);
        if (res.status === 200) {
          setBackendStatus("online");
        } else {
          setTimeout(checkBackend, 5000); // retry after 5s
        }
      } catch {
        setTimeout(checkBackend, 5000); // keep retrying until backend wakes up
      }
    };

    checkBackend();
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Prepare the payload
    const payload: LoginPayload = {
      email,
      password,
    };

    try {
      const response = await login(payload);
      console.log("Login successful:");
      console.log(response);
      localStorage.removeItem("chatMessages");
      window.location.href = `${FRONTEND_URL}`;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      if(axiosError.status === 401) {
        toast.error("Invalid credentials!");
        setPassword("");
        return;
      }
      alert("Login failed. Please refresh the page and try again!");
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-block w-3 h-3 rounded-full ${
            backendStatus === "online" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {backendStatus === "online"
            ? "All Systems Online"
            : "⏳ Starting backend service, please wait up to 60s..."}
        </p>
      </div>

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To view App demo Sign In with:
              <br />
              Email: demo@gmail.com and Password: demo@gmail.com 
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="demo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                   />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="demo@gmail.com"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                </div>
                <div>
                  {/* <button
                    onClick={handleClick}
                    disabled={backendStatus !== "online"}   // 🔒 disable if backend is not ready
                    className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs
                      ${backendStatus !== "online"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-brand-500 hover:bg-brand-600"
                      }`}
                  >
                    Sign In
                  </button> */}
                  <button
                    onClick={handleClick}
                    disabled={backendStatus !== "online" || isLoading}
                    className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs
                      ${
                        backendStatus !== "online" || isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-brand-500 hover:bg-brand-600"
                      }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don't have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
