import { motion } from "framer-motion";

export function HomePage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold">My App</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hi, {user}</span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition"
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
          className="bg-white p-10 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-semibold">Welcome, {user} 👋</h2>
          <p className="text-gray-500 mt-2">You are successfully logged in.</p>
        </motion.div>
      </div>
    </div>
  );
}
