import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link, useNavigate } from "react-router-dom";
import { Network, MessageSquarePlus } from "lucide-react";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 rounded-2xl bg-[#111218] border border-[rgba(255,255,255,0.08)] shadow-2xl flex items-center justify-center mb-6">
          <Network className="w-10 h-10 text-[#00E5FF] opacity-80" />
        </div>
        <h1 className="text-3xl font-space font-bold text-white mb-3 tracking-tight">No Connections Found</h1>
        <p className="text-[#bac9cc] max-w-md mb-8">You haven't made any connections yet. Start swiping in the developer feed to build your network.</p>
        <button onClick={() => navigate("/")} className="bg-[#111218] hover:bg-[#18181B] border border-[rgba(255,255,255,0.1)] hover:border-[#00E5FF]/50 text-white px-6 py-3 rounded-xl transition-all font-medium flex items-center gap-2">
           Discover Developers
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-space font-bold text-white text-3xl tracking-tight">Network</h1>
          <span className="px-3 py-1 bg-[#00E5FF]/10 text-[#00E5FF] font-mono text-xs rounded-full border border-[#00E5FF]/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
            {connections.length} Nodes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {connections.filter(c => c).map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

          return (
            <div
              key={_id}
              className="flex flex-col sm:flex-row items-center p-6 rounded-3xl bg-[#111218]/90 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,229,255,0.05)] hover:border-[#00E5FF]/30 group"
            >
              <div className="flex-shrink-0 mb-4 sm:mb-0 relative">
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-2xl object-cover border border-[rgba(255,255,255,0.1)] shadow-xl"
                  src={photoUrl}
                />
              </div>
              <div className="flex-1 min-w-0 sm:mx-6 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white truncate font-space mb-1">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-[#00E5FF] text-[11px] font-mono tracking-widest uppercase mb-3">
                    {age}YO • {gender}
                  </p>
                )}
                {connection.skills && connection.skills.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-3">
                    {connection.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] font-mono text-gray-300 bg-[#18181B] border border-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                    {connection.skills.length > 3 && (
                      <span className="text-[10px] font-mono text-gray-500 px-1 py-0.5">+{connection.skills.length - 3}</span>
                    )}
                  </div>
                )}
                <p className="text-[#bac9cc] text-sm truncate">{about}</p>
              </div>
              <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                <Link to={"/chat/" + _id} className="block w-full">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF]/10 to-[#00daf3]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#001f24] transition-all font-bold font-space text-sm shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]">
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Connections;