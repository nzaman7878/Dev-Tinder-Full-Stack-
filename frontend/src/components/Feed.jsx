import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  if (!feed) return;

  if (feed.length <= 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#111218] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-6">
          <span className="text-[#00E5FF] text-2xl font-mono">{'</>'}</span>
        </div>
        <h1 className="text-2xl font-space font-bold text-white mb-2 tracking-tight">No developers found in your area</h1>
        <p className="text-gray-400 max-w-md">You've reviewed all available profiles for now. Check back later to discover more matches.</p>
      </div>
    );

  return (
    feed && (
      <div className="flex justify-center my-8 md:my-12 px-4 animate-fade-in-up">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};
export default Feed;