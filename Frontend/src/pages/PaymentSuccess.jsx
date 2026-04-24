import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 text-center animate-in zoom-in-95 duration-500">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={40} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">Securely Verified</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Your transaction has been captured and the provider is notified.</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
              Go to Dashboard <ArrowRight size={18} />
            </button>
          </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
