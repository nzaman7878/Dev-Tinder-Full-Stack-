import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { X, Heart } from "lucide-react";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills, interests } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto bg-[#111218]/95 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)] transform transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,229,255,0.08)] hover:border-[rgba(255,255,255,0.15)] flex flex-col group">
      
      {/* Image Section */}
      <div className="relative h-[320px] w-full bg-gradient-to-b from-[#18181B] to-[#111218] flex-shrink-0 overflow-hidden">
        <img 
          src={user.photoUrl} 
          alt="photo" 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          onError={(e) => { e.target.src = "https://geographyandyou.com/images/user-profile.png"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111218] via-[#111218]/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl font-space font-extrabold text-white tracking-tight drop-shadow-md">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="font-mono text-[11px] text-[#00E5FF] mt-1.5 tracking-[0.15em] uppercase font-bold drop-shadow-md">
              {age}yo • {gender}
            </p>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 pt-2 flex flex-col gap-6">
        
        {/* About */}
        {about && (
          <div>
            <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">About</h3>
            <p className="text-[#bac9cc] text-sm leading-relaxed line-clamp-3">
              {about}
            </p>
          </div>
        )}
        
        {/* Skills & Interests container (Scrollable if too tall) */}
        <div className="max-h-[120px] overflow-y-auto custom-scrollbar space-y-5 pr-2">
          {skills && skills.length > 0 && (
            <div>
              <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span key={index} className="px-2.5 py-1 bg-[#18181B] border border-[rgba(255,255,255,0.06)] text-gray-300 text-[11px] font-mono rounded-lg shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests && interests.length > 0 && (
            <div>
              <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Interests</h3>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, index) => (
                  <span key={index} className="px-2.5 py-1 bg-[rgba(0,229,255,0.05)] border border-[#00E5FF]/20 text-[#00E5FF] text-[11px] font-medium rounded-lg shadow-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            className="flex-1 flex justify-center items-center gap-2 py-3.5 rounded-2xl border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white hover:border-[#ff4c4c]/50 hover:bg-[#ff4c4c]/20 hover:shadow-[0_0_20px_rgba(255,76,76,0.2)] transition-all font-bold font-space group/btn"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <X className="w-6 h-6 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-90" />
          </button>
          <button
            className="flex-1 flex justify-center items-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#00daf3] text-[#001f24] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all font-bold font-space group/btn hover:scale-[1.02] active:scale-95"
            onClick={() => handleSendRequest("interested", _id)}
          >
            <Heart className="w-6 h-6 transition-transform duration-300 group-hover/btn:scale-125" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;