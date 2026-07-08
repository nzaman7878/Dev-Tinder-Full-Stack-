import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import EmojiPicker from "emoji-picker-react";
import { 
  Search, 
  Settings, 
  Paperclip, 
  Smile, 
  Send,
  MoreVertical,
  Phone,
  Video,
  MessageSquare,
  Users
} from "lucide-react";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatMessages = async (targetId) => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetId, {
        withCredentials: true,
      });
      setMessages(chat.data.messages || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (targetUserId) {
      fetchChatMessages(targetUserId);
    } else {
      setMessages([]);
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    socket.emit("userConnected", { userId });

    socket.on("onlineUsers", (usersArray) => {
      setOnlineUsers(new Set(usersArray));
    });

    if (targetUserId) {
      socket.emit("joinChat", {
        firstName: user.firstName,
        userId,
        targetUserId,
      });
    }

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("userTyping", ({ userId: typingUserId }) => {
      setTypingUsers((prev) => new Set(prev).add(typingUserId));
    });

    socket.on("userStoppedTyping", ({ userId: typingUserId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(typingUserId);
        return newSet;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user?.firstName]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current && targetUserId) {
      socketRef.current.emit("typing", { userId, targetUserId });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("stopTyping", { userId, targetUserId });
      }, 1500);
    }
  };

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    if (socketRef.current && targetUserId) {
      socketRef.current.emit("sendMessage", {
        firstName: user.firstName,
        lastName: user.lastName,
        userId,
        targetUserId,
        text: newMessage,
      });
      setNewMessage("");
      setShowEmojiPicker(false);
      socketRef.current.emit("stopTyping", { userId, targetUserId });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!targetUserId) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploadingImage(true);
      const res = await axios.post(BASE_URL + "/chat/photo", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          firstName: user.firstName,
          lastName: user.lastName,
          userId,
          targetUserId,
          text: "",
          imageUrl: res.data.imageUrl,
        });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const filteredConnections = connections.filter(conn => 
    conn.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConnection = connections.find(c => c._id === targetUserId);

  return (
    <div className="flex h-full w-full bg-[#0d1516] text-[#dce4e5] font-['Inter'] overflow-hidden">
      
      {/* Sidebar - Connection List */}
      <aside className={`w-full md:w-80 border-r border-[#3b494c]/30 flex flex-col bg-[#0d1516] transition-all ${targetUserId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 space-y-4">
          <div className="bg-[#080f11] border border-[#3b494c]/30 rounded-lg p-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#8ac1cc]" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-[#dce4e5] w-full p-0 placeholder-[#bac9cc]/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar pr-2">
            {filteredConnections.map((conn) => (
              <div 
                key={conn._id}
                onClick={() => navigate(`/chat/${conn._id}`)}
                className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg transition-all ${targetUserId === conn._id ? 'bg-[#11505a] text-[#8ac1cc]' : 'hover:bg-[#192122] text-[#bac9cc]'}`}
              >
                <div className="relative">
                  <img src={conn.photoUrl || "https://geographyandyou.com/images/user-profile.png"} alt="avatar" className="w-12 h-12 rounded-lg object-cover" />
                  {onlineUsers.has(conn._id) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00e5ff] border-2 border-[#0d1516] rounded-full shadow-[0_0_8px_#00E5FF]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="truncate font-bold font-['Space_Grotesk']">
                      {conn.firstName} {conn.lastName}
                    </span>
                  </div>
                  <p className="text-xs truncate font-normal opacity-80">
                    {typingUsers.has(conn._id) ? "Typing..." : "Click to view chat"}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredConnections.length === 0 && (
              <p className="text-center text-[#bac9cc]/50 text-sm py-8">No connections found.</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className={`flex-1 flex flex-col relative ${!targetUserId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!targetUserId ? (
          <div className="text-center space-y-4 text-[#bac9cc]/60">
            <MessageSquare className="w-16 h-16 mx-auto opacity-20" />
            <h2 className="text-xl font-['Space_Grotesk']">Select a conversation to start messaging</h2>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-[#3b494c]/20 px-6 flex items-center justify-between bg-[#080f11]/40 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2 text-[#bac9cc]" onClick={() => navigate('/chat')}>
                  ←
                </button>
                <div className="relative">
                  <img src={activeConnection?.photoUrl || "https://geographyandyou.com/images/user-profile.png"} className="w-11 h-11 rounded-lg object-cover" alt="Avatar" />
                  {onlineUsers.has(targetUserId) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00e5ff] border-2 border-[#0d1516] rounded-full shadow-[0_0_8px_#00E5FF]"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-['Space_Grotesk'] font-bold text-[#dce4e5]">
                      {activeConnection?.firstName} {activeConnection?.lastName}
                    </h2>
                    {onlineUsers.has(targetUserId) && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#11505a]/30 text-[#00daf3] border border-[#00daf3]/20 uppercase tracking-widest">
                        Online
                      </span>
                    )}
                  </div>
                  {activeConnection?.skills?.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {activeConnection.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-[10px] text-[#bac9cc]/70 font-mono">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-[#bac9cc] hover:text-[#00daf3] transition-colors"><Video className="w-5 h-5" /></button>
                <button className="text-[#bac9cc] hover:text-[#00daf3] transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="text-[#bac9cc] hover:text-[#00daf3] transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
              {messages.map((msg, index) => {
                const isSent = msg.senderId === userId || msg.senderId?._id === userId;
                return (
                  <div key={msg._id || index} className={`flex items-end gap-3 max-w-[80%] ${isSent ? 'ml-auto flex-row-reverse' : ''}`}>
                    {!isSent && (
                       <img src={activeConnection?.photoUrl || "https://geographyandyou.com/images/user-profile.png"} className="w-8 h-8 rounded-lg object-cover mb-1" alt="avatar" />
                    )}
                    <div className={`p-4 rounded-2xl ${isSent ? 'bg-[#00e5ff] text-[#00363d] rounded-br-none shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-[#18181b]/60 backdrop-blur-xl border border-white/5 text-[#dce4e5] rounded-bl-none'}`}>
                      {msg.imageUrl && (
                        <img src={msg.imageUrl} alt="attachment" className="rounded-xl mb-3 max-w-full h-auto max-h-64 object-cover" />
                      )}
                      {msg.text && (
                         <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                      )}
                      <span className={`text-[9px] mt-2 block ${isSent ? 'opacity-70 text-right' : 'text-[#bac9cc]/50'}`}>
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {typingUsers.has(targetUserId) && (
                 <div className="flex items-end gap-3 max-w-[80%]">
                   <img src={activeConnection?.photoUrl || "https://geographyandyou.com/images/user-profile.png"} className="w-8 h-8 rounded-lg object-cover mb-1" alt="avatar" />
                   <div className="bg-[#18181b]/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl rounded-bl-none flex gap-1">
                      <span className="w-2 h-2 bg-[#bac9cc]/50 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#bac9cc]/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-[#bac9cc]/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#0d1516] via-[#0d1516] to-transparent">
              {showEmojiPicker && (
                <div className="absolute bottom-24 right-6 z-50 shadow-2xl rounded-xl overflow-hidden border border-[#3b494c]">
                  <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                </div>
              )}
              
              <form onSubmit={sendMessage} className="max-w-4xl mx-auto w-full">
                <div className="bg-[#18181b]/60 backdrop-blur-xl p-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-[#00daf3]/20">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={uploadingImage}
                    className="p-2 text-[#bac9cc] hover:text-[#00daf3] transition-colors rounded-lg disabled:opacity-50"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 relative flex items-center bg-[#080f11]/50 rounded-xl px-4 py-2 border border-[#3b494c]/20 focus-within:border-[#00daf3]/50 transition-colors">
                    <input 
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Type a message..."
                      className="bg-transparent border-none focus:ring-0 text-sm text-[#dce4e5] w-full p-0 placeholder-[#bac9cc]/40"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1 text-[#bac9cc] hover:text-[#00daf3] transition-colors ml-2"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim() && !uploadingImage}
                    className="bg-[#00e5ff] text-[#00363d] px-4 md:px-6 py-2 md:py-3 rounded-xl flex items-center gap-2 font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <span className="hidden md:inline">Send</span>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Chat;