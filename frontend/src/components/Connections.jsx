import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-[#111218] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-6">
          <span className="text-gray-500 text-2xl font-mono">0</span>
        </div>
        <h1 className="text-2xl font-space font-bold text-white mb-2 tracking-tight">No Connections Found</h1>
        <p className="text-gray-400 max-w-md">You haven't made any connections yet. Start swiping in the developer feed to build your network.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-space font-bold text-white text-3xl tracking-tight">Network</h1>
        <span className="px-3 py-1 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] font-mono text-xs rounded-full border border-[rgba(0,229,255,0.2)]">
          {connections.length} Nodes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {connections.filter(c => c).map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center p-5 rounded-2xl bg-[#18181B] border border-[rgba(255,255,255,0.08)] transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,229,255,0.05)] hover:border-[rgba(0,229,255,0.2)]"
            >
              <div className="flex-shrink-0">
                <img
                  alt="photo"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#111218] shadow-lg"
                  src={photoUrl}
                />
              </div>
              <div className="flex-1 min-w-0 mx-4">
                <h2 className="text-lg font-bold text-white truncate font-space">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-[#00E5FF] text-xs font-mono mt-1 tracking-wider uppercase">
                    {age}yo • {gender}
                  </p>
                )}
                <p className="text-gray-400 text-sm mt-1 truncate">{about}</p>
              </div>
              <div>
                <Link to={"/chat/" + _id}>
                  <button className="py-2 px-4 rounded-xl bg-[rgba(0,229,255,0.1)] border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#001f24] transition-all font-bold font-space text-sm shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                    Chat
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