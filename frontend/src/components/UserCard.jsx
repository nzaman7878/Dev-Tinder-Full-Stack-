import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills, interests } = user;
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
    <div className="w-full max-w-sm mx-auto bg-[#18181B] rounded-3xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.08)] transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,229,255,0.05)] flex flex-col h-[38rem]">
      <div className="relative h-72 w-full bg-[#111218] flex-shrink-0">
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
      
      <div className="p-6 flex flex-col flex-1 overflow-hidden">
        <div className="mb-4 flex-shrink-0">
          <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">About</h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {about || "No bio provided."}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
          {skills && skills.length > 0 && (
            <div>
              <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-[#111218] border border-[rgba(255,255,255,0.08)] text-gray-300 text-xs font-mono rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests && interests.length > 0 && (
            <div>
              <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-[rgba(0,229,255,0.05)] border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 mt-auto pt-2 border-t border-[rgba(255,255,255,0.05)]">
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