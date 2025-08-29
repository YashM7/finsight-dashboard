import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import axios, { AxiosError } from "axios";

import { signup, SignupPayload } from "../../api/auth";
import toast from "react-hot-toast";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;


export default function SignUpForm() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"starting" | "online">(
    "starting"
  );

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/ping`);
        console.log(res);
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
    if (!firstName || !lastName || !email || !password) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white text-gray-800 px-4 py-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 flex justify-between items-center`}
        >
          <span>Please fill in all required fields</span>
        </div>
      ));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!isChecked) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white text-gray-800 px-4 py-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 flex justify-between items-center`}
        >
          <span>Please accept the terms and conditions</span>
        </div>
      ));
      return;
    }

    // Prepare the payload for signup
    // Ensure the payload matches the SignupPayload interface
    // Adjust the payload structure based on your backend requirements
    const payload: SignupPayload = {
      firstName,
      lastName,
      email,
      password
    };

    try {
      const response = await signup(payload);
      console.log(response);
      localStorage.removeItem("chatMessages");
      window.location.href = "http://localhost:5173/";
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Signup failed:", error);
      if(axiosError.status === 409) {
        toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white text-gray-800 px-4 py-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 flex justify-between items-center`}
        >
          <span>Email already exists. Please login.</span>
        </div>
      ));

        setTimeout(() => {
          window.location.href = "http://localhost:5173/signin";
        }, 3000);

        return;
      }
      alert("Signup failed. Please refresh the page and try again!");
      window.location.reload();
    }

  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
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
            : "⏳ Starting backend service, please wait up to 30s..."}
        </p>
      </div>
      
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To view App demo Sign In with:
              <br />
              Email: demo@gmail.com and Password: demo@gmail.com 
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
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
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button
                    onClick={handleClick}
                    disabled={backendStatus !== "online"}   // 🔒 disable if backend is not ready
                    className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs
                      ${backendStatus !== "online"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-brand-500 hover:bg-brand-600"
                      }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
