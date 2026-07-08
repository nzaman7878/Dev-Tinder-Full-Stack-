import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Check, X } from "lucide-react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 rounded-2xl bg-[#111218] border border-[rgba(255,255,255,0.08)] shadow-2xl flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-gray-500 opacity-80" />
        </div>
        <h1 className="text-3xl font-space font-bold text-white mb-3 tracking-tight">No Pending Requests</h1>
        <p className="text-[#bac9cc] max-w-md mb-8">You're all caught up! There are no new connection requests waiting for your review.</p>
        <button onClick={() => navigate("/")} className="bg-[#111218] hover:bg-[#18181B] border border-[rgba(255,255,255,0.1)] hover:border-[#00E5FF]/50 text-white px-6 py-3 rounded-xl transition-all font-medium flex items-center gap-2">
           Discover Developers
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-space font-bold text-white text-3xl tracking-tight">Incoming Requests</h1>
          <span className="px-3 py-1 bg-[rgba(254,201,49,0.1)] text-[#FEC931] font-mono text-xs rounded-full border border-[rgba(254,201,49,0.2)] shadow-[0_0_10px_rgba(254,201,49,0.1)]">
            {requests.length} Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.filter(r => r.fromUserId).map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;

          return (
            <div
              key={request._id}
              className="flex flex-col md:flex-row justify-between items-center p-6 rounded-3xl bg-[#111218]/90 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.15)] group"
            >
              <div className="flex flex-col sm:flex-row items-center w-full md:w-auto mb-6 md:mb-0">
                <div className="flex-shrink-0 mb-4 sm:mb-0 relative">
                  <img
                    alt="photo"
                    className="w-20 h-20 rounded-2xl object-cover border border-[rgba(255,255,255,0.1)] shadow-xl"
                    src={photoUrl}
                  />
                </div>
                <div className="text-center sm:text-left sm:mx-6 min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-white truncate font-space mb-1">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-[#00E5FF] text-[11px] font-mono tracking-widest uppercase mb-3">
                      {age}YO • {gender}
                    </p>
                  )}
                  {request.fromUserId.skills && request.fromUserId.skills.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-3">
                      {request.fromUserId.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] font-mono text-gray-300 bg-[#18181B] border border-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                      {request.fromUserId.skills.length > 3 && (
                        <span className="text-[10px] font-mono text-gray-500 px-1 py-0.5">+{request.fromUserId.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                  <p className="text-[#bac9cc] text-sm truncate max-w-md">{about}</p>
                </div>
              </div>
              
              <div className="flex w-full md:w-auto gap-4">
                <button
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 px-6 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-[#ff4c4c] hover:border-[#ff4c4c]/30 hover:bg-[#ff4c4c]/10 transition-colors font-medium font-space text-sm"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF]/10 to-[#00daf3]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#001f24] transition-all font-bold font-space text-sm shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  <Check className="w-4 h-4" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Requests;