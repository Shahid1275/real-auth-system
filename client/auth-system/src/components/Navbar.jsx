import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const sendverificationotp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      toast.success("user logout successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0">
            <img
              src={assets.logo}
              alt="Company Logo"
              className="h-10 sm:h-12 w-auto transition-transform hover:scale-105 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          {userData ? (
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
              {userData.name[0].toUpperCase()}
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                <ul className="list-none m-0 p-2 bg-gray-100 text-sm ">
                  {!userData.isAccountVerified && (
                    <li
                      onClick={sendverificationotp}
                      className="py-1 px-2 cursor-pointer hover:bg-gray-200"
                    >
                      Verify email
                    </li>
                  )}

                  <li
                    onClick={logout}
                    className="py-1 px-2 cursor-pointer hover:bg-gray-200 pr-10"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center space-x-2 bg-transparent border border-gray-300 hover:border-gray-400 rounded-full px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-sm cursor-pointer group"
              aria-label="Login or sign up"
            >
              <span>Login</span>
              <img
                src={assets.arrow_icon}
                alt=""
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
