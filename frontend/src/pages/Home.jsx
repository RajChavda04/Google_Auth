import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function HomePage({ user, onLogout }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen  transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Navbar */}
      <div className={`flex items-center justify-between  px-6 py-4 shadow-md transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-center">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-6 h-6" />
        <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>      
          oogle Auth</h1>
          </div>
        <div className="flex items-center  gap-4">
          <span className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>Hi, {user}</span>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 cursor-pointer rounded-lg transition-colors duration-300 ${
              isDark ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer duration-300 ${
              isDark ? "bg-red-600 text-white hover:bg-red-700" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Logout
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 rounded-2xl shadow-lg text-center transition-colors duration-300 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-semibold">Welcome, {user} 👋</h2>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>You are successfully logged in.</p>
        </motion.div>
      </div>
    </div>
  );
}
