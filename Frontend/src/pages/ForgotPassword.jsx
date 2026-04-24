import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPasswordFlow } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPasswordFlow(email);
    setLoading(false);
    
    if (result.success) {
      toast.success("OTP has been sent to your email!");
      // Navigate to reset password and pass email in state
      navigate('/reset-password', { state: { email } });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent flex-col pb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h2>
          <p className="text-gray-500 dark:text-gray-400">Enter your email to receive a reset code</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full border dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-blue-500/30">
          {loading ? 'Sending...' : 'Send Reset Code'}
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Remembered your password? <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
