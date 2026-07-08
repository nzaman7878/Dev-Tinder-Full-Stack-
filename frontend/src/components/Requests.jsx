import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-[#111218] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-6">
          <span className="text-gray-500 text-2xl font-mono">0</span>
        </div>
        <h1 className="text-2xl font-space font-bold text-white mb-2 tracking-tight">No Pending Requests</h1>
        <p className="text-gray-400 max-w-md">You're all caught up! There are no new connection requests waiting for your review.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-space font-bold text-white text-3xl tracking-tight">Incoming Requests</h1>
        <span className="px-3 py-1 bg-[rgba(254,201,49,0.1)] text-[#FEC931] font-mono text-xs rounded-full border border-[rgba(254,201,49,0.2)]">
          {requests.length} Pending
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.filter(r => r.fromUserId).map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;

          return (
            <div
              key={request._id}
              className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl bg-[#18181B] border border-[rgba(255,255,255,0.08)] transform transition-all duration-300 hover:shadow-lg hover:border-[rgba(255,255,255,0.15)]"
            >
              <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <div className="flex-shrink-0">
                  <img
                    alt="photo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#111218] shadow-lg"
                    src={photoUrl}
                  />
                </div>
                <div className="text-left mx-4 min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-white truncate font-space">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-[#00E5FF] text-xs font-mono mt-1 tracking-wider uppercase">
                      {age}yo • {gender}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mt-1 truncate max-w-md">{about}</p>
                </div>
              </div>
              
              <div className="flex w-full sm:w-auto gap-3">
                <button
                  className="flex-1 sm:flex-none py-2 px-6 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors font-medium font-space text-sm"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="flex-1 sm:flex-none py-2 px-6 rounded-xl bg-[rgba(0,229,255,0.1)] border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#001f24] transition-all font-bold font-space text-sm shadow-[0_0_10px_rgba(0,229,255,0.1)]"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
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