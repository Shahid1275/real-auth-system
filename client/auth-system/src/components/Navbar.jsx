import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo with better hover effect */}
                    <div className="flex-shrink-0">
                        <img 
                            src={assets.logo} 
                            alt="Company Logo" 
                            className="h-10 sm:h-12 w-auto transition-transform hover:scale-105 cursor-pointer"
                            onClick={() => navigate("/")} // Added home navigation
                        />
                    </div>

                    {/* Button with better styling and animation */}
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;