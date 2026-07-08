import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { CheckCircle2, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevTinder Premium",
        description: "Connect with elite developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#00E5FF",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  if (isUserPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in-up">
        <div className="w-24 h-24 bg-[#00E5FF]/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.3)]">
          <Crown className="w-12 h-12 text-[#00E5FF]" />
        </div>
        <h1 className="text-3xl font-space font-bold text-white tracking-tight">
          You're a Premium Member!
        </h1>
        <p className="text-[#bac9cc] max-w-md">
          Enjoy unlimited connections, the verified blue tick, and priority visibility in the DevTinder network.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#111218] border border-[rgba(255,255,255,0.08)] hover:border-[#00E5FF]/50 text-white px-8 py-3 rounded-xl transition-all font-medium"
        >
          Discover Developers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-space font-bold text-white tracking-tight">
          Upgrade your <span className="text-[#00E5FF]">DevTinder</span> Experience
        </h1>
        <p className="text-[#bac9cc] text-lg max-w-2xl mx-auto">
          Unlock unlimited potential, stand out with a verified badge, and connect with top-tier developers globally.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {/* Silver Tier */}
        <div className="flex-1 bg-[#111218]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 flex flex-col hover:border-[rgba(255,255,255,0.2)] transition-all">
          <div className="mb-8">
            <h2 className="text-2xl font-space font-bold text-white mb-2">Silver</h2>
            <p className="text-[#bac9cc] text-sm">Perfect for getting started and expanding your network.</p>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-bold text-white">₹300</span>
            <span className="text-[#bac9cc]">/3 months</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-[#8ac1cc]" />
              <span>Chat with connected developers</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-[#8ac1cc]" />
              <span>100 connection requests per day</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-[#8ac1cc]" />
              <span>Verified Blue Tick</span>
            </li>
          </ul>

          <button
            onClick={() => handleBuyClick("silver")}
            className="w-full bg-[#18181B] hover:bg-[#242b2d] border border-[rgba(255,255,255,0.1)] text-white font-semibold py-4 rounded-xl transition-all"
          >
            Get Silver
          </button>
        </div>

        {/* Gold Tier */}
        <div className="flex-1 bg-[#0d1516] backdrop-blur-xl border border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.1)] rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00E5FF] to-[#00daf3] text-[#00363d] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <Zap className="w-3 h-3" /> Recommended
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-space font-bold text-[#00E5FF] mb-2">Gold</h2>
            <p className="text-[#bac9cc] text-sm">For elite developers who want zero limits.</p>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-bold text-white">₹700</span>
            <span className="text-[#bac9cc]">/6 months</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
              <span>Chat with connected developers</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
              <span className="font-medium text-white">Infinite connection requests per day</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
              <span>Verified Blue Tick</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
              <span>Priority profile visibility</span>
            </li>
          </ul>

          <button
            onClick={() => handleBuyClick("gold")}
            className="w-full bg-gradient-to-r from-[#00E5FF] to-[#00daf3] hover:from-[#00daf3] hover:to-[#9cf0ff] text-[#00363d] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-95"
          >
            Get Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;