import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-[#18181B] rounded-3xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.08)] transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,229,255,0.05)]">
      <div className="relative h-80 w-full bg-[#111218]">
        <img src={user.photoUrl} alt="photo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-[#18181B]/40 to-transparent"></div>
        <div className="absolute bottom-4 left-6 right-6">
          <h2 className="text-2xl font-space font-bold text-white tracking-tight">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="font-mono text-xs text-[#00E5FF] mt-1 tracking-wider uppercase">
              {age}yo • {gender}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">About</h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
            {about || "No bio provided."}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            className="flex-1 py-3 px-4 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors font-medium font-space"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="flex-1 py-3 px-4 rounded-xl bg-[rgba(0,229,255,0.1)] border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#001f24] transition-all font-bold font-space shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;