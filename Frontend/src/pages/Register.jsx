import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      toast.success("Account Created Successfully!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Join our community today</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              required
              className="w-full border dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full border dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full border dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Register As</label>
            <select
              className="w-full border dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all appearance-none"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User / Client</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-blue-500/30">
          Sign Up
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default Register;