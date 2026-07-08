import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Something went wrong");
    }
  };

  return (
  return (
    <>
      <div className="max-w-6xl mx-auto my-8 px-4 flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in-up">
        <div className="w-full lg:w-3/5 bg-[#111218]/90 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-8 border-b border-[rgba(255,255,255,0.05)] pb-6">
            <h2 className="text-2xl font-space font-bold text-white tracking-tight">Profile Configuration</h2>
            <p className="text-gray-400 text-sm mt-1">Update your developer details and public persona.</p>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all" />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Photo URL</label>
              <input type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all" />
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Age</label>
                <input type="text" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all" />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Gender</label>
                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">About (Bio)</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 h-28 resize-none focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"></textarea>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button onClick={saveProfile} className="bg-[#00E5FF] hover:bg-[#00daf3] text-[#001f24] font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-2/5 mt-2 lg:mt-0">
          <div className="sticky top-28">
            <div className="mb-4">
               <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider">Live Preview</h3>
            </div>
            <UserCard user={{ _id: user._id, firstName, lastName, photoUrl, age, gender, about }} />
          </div>
        </div>
      </div>
      
      {showToast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-[#18181B] border border-[#00E5FF]/30 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,229,255,0.2)] flex items-center gap-3">
            <span className="text-[#00E5FF]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </span>
            <span className="text-white text-sm font-medium">Profile configured successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;