import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      // Error logic maybe redirect to error page
      console.log(err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold font-space text-white tracking-tight flex items-center gap-2 transition-transform hover:scale-105">
            <span className="text-[#00E5FF]">init</span> --social
          </Link>
        </div>
        {user && (
          <div className="flex-none gap-4">
            <div className="hidden sm:block text-sm font-medium text-gray-300">
              Welcome, <span className="text-white">{user.firstName}</span>
            </div>
            <div className="dropdown dropdown-end flex">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar ring-1 ring-[rgba(255,255,255,0.1)] hover:ring-[#00E5FF] transition-all"
              >
                <div className="w-10 rounded-full">
                  <img alt={`${user.firstName}'s profile`} src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#111218] border border-[rgba(255,255,255,0.08)] rounded-xl z-[1] mt-4 w-56 p-2 shadow-2xl"
              >
                <li>
                  <Link to="/profile" className="justify-between hover:bg-[#18181B] hover:text-[#00E5FF] transition-colors rounded-lg py-2">
                    Profile
                    <span className="badge badge-sm bg-[#00E5FF] text-black border-none font-semibold">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="hover:bg-[#18181B] hover:text-[#00E5FF] transition-colors rounded-lg py-2">Connections</Link>
                </li>
                <li>
                  <Link to="/requests" className="hover:bg-[#18181B] hover:text-[#00E5FF] transition-colors rounded-lg py-2">Requests</Link>
                </li>
                <li>
                  <Link to="/chat" className="hover:bg-[#18181B] hover:text-[#00E5FF] transition-colors rounded-lg py-2">Chat</Link>
                </li>
                <li>
                  <Link to="/premium" className="hover:bg-[#18181B] hover:text-[#00E5FF] transition-colors rounded-lg py-2">Premium</Link>
                </li>
                <div className="divider my-1 border-[rgba(255,255,255,0.05)]"></div>
                <li>
                  <a onClick={handleLogout} className="text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg py-2">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default NavBar;