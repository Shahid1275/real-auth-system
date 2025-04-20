import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      axios.defaults.withCredentials = true;
      e.preventDefault();

      if (state === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Account created successfully! Please login.");
          setState("Log In");
          setName("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      } else {
        // This handles the Login case
        const response = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setIsLoggedin(true);
          await getUserData(); // Wait for user data to be fetched
          toast.success("Login successful!");
          navigate("/"); // Redirect to home after fetching user data
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="login"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Log In"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your Account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="person" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Full Name"
                className="bg-transparent outline-none"
                type="text"
                name="Full name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="email" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Your Email"
              className="bg-transparent outline-none"
              type="email"
              name="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="password" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Your Password"
              className="bg-transparent outline-none"
              type="password"
              name="password"
              required
            />
          </div>
          {state === "Log In" && (
            <p
              className="mb-4 text-indigo-500 cursor-pointer"
              onClick={() => navigate("/reset-password")}
            >
              Forget password?
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium cursor-pointer"
          >
            {state}
          </button>
        </form>
        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Log In")}
                className="text-blue-400 cursor-pointer underline"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
