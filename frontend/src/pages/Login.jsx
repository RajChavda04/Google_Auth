import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.config";
import { AuthContext } from "../context/AuthContext";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, googleLogin, loading } = useContext(AuthContext);
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        {errors.form && <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4 text-center">{errors.form}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 focus-within:ring-black">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 outline-none"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 focus-within:ring-black">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-black"
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
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {errors.google && <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4 text-center">{errors.google}</p>}

        {/* Google Login */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5 "
          />
          Continue with Google
        </motion.button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <span className="text-black font-medium cursor-pointer hover:underline">Sign up</span>
        </p>
      </motion.div>
    </div>
  );
}
