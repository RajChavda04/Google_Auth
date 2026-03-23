import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.config";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, googleLogin, loading } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const handleGoogleLogin = async () => {
    try {
      // Create a new GoogleAuthProvider instance for each login
      const googleProvider = new GoogleAuthProvider();
      
      // Force account selection dialog to appear every time
      googleProvider.setCustomParameters({
        prompt: "select_account", // Always show account selection
      });

      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email: googleEmail } = result.user;
      const response = await googleLogin(displayName || "User", googleEmail);
      if (response.success) {
        console.log("Google Login Success", response.user);
        navigate("/home");
      } else {
        setErrors({ google: response.message });
      }
    } catch (error) {
      console.error("Google Login Error", error.message);
      setErrors({ google: error.message });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await login(email, password);
      if (result.success) {
        console.log("Login Success", result.user);
        navigate("/home");
      } else {
        setErrors({ form: result.message });
      }
    }
  };

  return (
    <div className={`min-h-screen p-5 sm:p-2 flex items-center justify-center transition-colors duration-300 ${
      isDark ? "bg-gradient-to-br  from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-100 to-gray-200"
    }`}>
      {/* Dark Mode Toggle Button */}
      <motion.button
        className={`absolute top-6 right-6 p-2 rounded-lg transition-colors duration-300 ${
          isDark ? "bg-gray-800 text-yellow-400 cursor-pointer hover:bg-gray-700" : "bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300"
        }`}
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md shadow-xl rounded-2xl p-8 transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className={`text-2xl font-bold text-center mb-6 ${isDark ? "text-white" : "text-black"}`}>Welcome Back</h2>

        {errors.form && <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4 text-center">{errors.form}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</label>
            <div className={`flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 ${
              isDark ? "border-gray-600 focus-within:ring-blue-500 bg-gray-700" : "border-gray-300 focus-within:ring-black bg-white"
            }`}>
              <Mail size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full p-2 outline-none ${isDark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Password</label>
            <div className={`flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 ${
              isDark ? "border-gray-600 focus-within:ring-blue-500 bg-gray-700" : "border-gray-300 focus-within:ring-black bg-white"
            }`}>
              <Lock size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full p-2 outline-none ${isDark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-black"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition  disabled:opacity-50 ${
              isDark ? "bg-blue-600 text-white cursor-pointer  hover:bg-blue-700" : "bg-black text-white cursor-not-allowed  hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className={`flex-1 h-px ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>
          <span className={`px-3 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>OR</span>
          <div className={`flex-1 h-px ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>
        </div>

        {errors.google && <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4 text-center">{errors.google}</p>}

        {/* Google Login */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className={`w-full flex items-center justify-center gap-2 border py-2 rounded-lg transition cursor-pointer disabled:opacity-50 ${
            isDark ? "border-gray-600 hover:bg-gray-700 text-white" : "border-gray-300 hover:bg-gray-100 text-black"
          }`}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </motion.button>

        {/* Footer */}
        <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Don't have an account? <span className={`font-medium cursor-pointer hover:underline ${isDark ? "text-blue-400" : "text-black"}`}>Sign up</span>
        </p>
      </motion.div>
    </div>
  );
}
