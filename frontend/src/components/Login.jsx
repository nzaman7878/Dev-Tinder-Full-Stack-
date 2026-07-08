import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#111218]/90 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-space font-bold text-white mb-2 tracking-tight">
            <span className="text-[#00E5FF]">init</span> --social-discovery
          </h2>
          <p className="text-gray-400 font-mono text-xs sm:text-sm">
            {isLoginForm ? "Authenticate to your network" : "Create your developer profile"}
          </p>
        </div>

        <div className="space-y-4">
          {!isLoginForm && (
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                  placeholder="Linus"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                  placeholder="Torvalds"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
              placeholder="developer@local.host"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={isLoginForm ? handleLogin : handleSignUp}
            className="w-full bg-[#00E5FF] hover:bg-[#00daf3] text-[#001f24] font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
          >
            {isLoginForm ? "Execute Login" : "Initialize Profile"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              setError("");
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            {isLoginForm ? (
              <>Don't have an account? <span className="text-[#00E5FF]">Sign up</span></>
            ) : (
              <>Already have an account? <span className="text-[#00E5FF]">Log in</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;