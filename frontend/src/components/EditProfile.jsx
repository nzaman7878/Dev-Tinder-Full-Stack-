import { useState, useRef } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Upload, X, Loader2 } from "lucide-react";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState("");
  
  const [interests, setInterests] = useState(user.interests || []);
  const [interestInput, setInterestInput] = useState("");

  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setIsUploading(true);
    setError("");
    try {
      const res = await axios.post(BASE_URL + "/profile/photo", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPhotoUrl(res.data.data.photoUrl);
      dispatch(addUser(res.data.data)); // Update store immediately
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    setPhotoUrl("https://geographyandyou.com/images/user-profile.png");
  };

  const handleAddChip = (e, type) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = type === "skill" ? skillInput.trim() : interestInput.trim();
      if (!val) return;
      
      if (type === "skill") {
        if (!skills.includes(val)) setSkills([...skills, val]);
        setSkillInput("");
      } else {
        if (!interests.includes(val)) setInterests([...interests, val]);
        setInterestInput("");
      }
    }
  };

  const removeChip = (type, index) => {
    if (type === "skill") {
      setSkills(skills.filter((_, i) => i !== index));
    } else {
      setInterests(interests.filter((_, i) => i !== index));
    }
  };

  const saveProfile = async () => {
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
          skills,
          interests
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto my-8 px-4 flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in-up">
        <div className="w-full lg:w-3/5 bg-[#111218]/90 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-8 border-b border-[rgba(255,255,255,0.05)] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-space font-bold text-white tracking-tight">Profile Configuration</h2>
              <p className="text-gray-400 text-sm mt-1">Update your developer details and public persona.</p>
            </div>
            
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.1)] group-hover:border-[#00E5FF] transition-colors relative bg-[#09090B] flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-[#00E5FF] animate-spin" />
                  ) : (
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  )}
                  
                  {/* Upload Overlay */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-[#00E5FF] hover:text-white transition-colors text-left">
                  Upload Photo
                </button>
                <button onClick={removePhoto} className="text-xs text-gray-500 hover:text-red-400 transition-colors text-left">
                  Remove
                </button>
              </div>
            </div>
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

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Age</label>
                <input type="number" min="18" max="100" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all" />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all appearance-none">
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">About (Bio)</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Write something about your developer journey..." className="w-full bg-[#09090B] text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"></textarea>
            </div>

            {/* Skills Array Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Tech Stack & Skills</label>
              <div className="w-full min-h-[50px] bg-[#09090B] border border-[rgba(255,255,255,0.1)] rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-[#00E5FF] focus-within:ring-1 focus-within:ring-[#00E5FF] transition-all">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1 bg-[#18181B] border border-[rgba(255,255,255,0.1)] px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-200 font-mono">{skill}</span>
                    <button onClick={() => removeChip("skill", index)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyDown={(e) => handleAddChip(e, "skill")}
                  placeholder={skills.length === 0 ? "e.g. React, Node.js, Python (Press Enter)" : "Add skill..."} 
                  className="flex-1 bg-transparent text-white min-w-[150px] outline-none text-sm px-2 font-mono"
                />
              </div>
            </div>

            {/* Interests Array Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 font-mono uppercase tracking-wider">Interests & Hobbies</label>
              <div className="w-full min-h-[50px] bg-[#09090B] border border-[rgba(255,255,255,0.1)] rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-[#00E5FF] focus-within:ring-1 focus-within:ring-[#00E5FF] transition-all">
                {interests.map((interest, index) => (
                  <div key={index} className="flex items-center gap-1 bg-[rgba(0,229,255,0.1)] border border-[#00E5FF]/20 px-3 py-1 rounded-full">
                    <span className="text-sm text-[#00E5FF] font-medium">{interest}</span>
                    <button onClick={() => removeChip("interest", index)} className="text-[#00E5FF]/70 hover:text-[#00E5FF] transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <input 
                  type="text" 
                  value={interestInput} 
                  onChange={(e) => setInterestInput(e.target.value)} 
                  onKeyDown={(e) => handleAddChip(e, "interest")}
                  placeholder={interests.length === 0 ? "e.g. Open Source, Web3, Hiking (Press Enter)" : "Add interest..."} 
                  className="flex-1 bg-transparent text-white min-w-[150px] outline-none text-sm px-2"
                />
              </div>
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
            <UserCard user={{ _id: user._id, firstName, lastName, photoUrl, age, gender, about, skills, interests }} />
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