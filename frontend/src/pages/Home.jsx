import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function HomePage({ user, onLogout }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-100"
        }`}
    >

      {/* Navbar */}
      <div
        className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-white"
          }`}
      >
        {/* LEFT: Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center ">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <h1
              className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-black"
                }`}
            >
              oogle
            </h1>
          </div>

          {/* User Name */}
          <span
            className={`text-sm font-medium sm:text-base ${isDark ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Hi , {user?.name}
          </span>
        </div>

        {/* RIGHT: Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer duration-300 ${isDark
              ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className={`px-3 sm:px-4 py-1.5 text-sm sm:text-base rounded-lg cursor-pointer transition-colors duration-300 ${isDark
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            Logout
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md sm:max-w-lg p-6 sm:p-10 rounded-2xl shadow-lg text-center transition-colors duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
        >
       
         
          <div className="flex justify-center mb-4">
           <img
           key={user?.picture}
            // src={user?.picture?.replace("=s96-c", "=s200-c")}
            src = {user?.picture}
            alt="profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-300 shadow-md"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name}`;
            }}
          />
          </div>

          {/* ✅ Name */}
          <h2 className="text-xl sm:text-2xl font-semibold">
            Welcome, {user?.name} 👋
          </h2>

          <p
            className={`mt-2 text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-500"
              }`}
          >
            You are successfully logged in.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

