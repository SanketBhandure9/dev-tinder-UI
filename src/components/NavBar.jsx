import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LOGOUT_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        LOGOUT_URL,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      // redirect to error page
    }
  };

  return (
    <>
      <div className="navbar sticky top-0 z-50 bg-white/90 shadow-md rounded-b-xl px-4 h-16 flex items-center justify-between backdrop-blur-lg">
        <div className="flex-1">
          <Link
            to="/feed"
            className="btn btn-ghost text-2xl font-bold tracking-tight text-primary hover:bg-primary/10 transition-colors rounded-lg"
          >
            <span className="inline-block align-middle mr-2">🔥</span>Dev Tinder
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          {user && (
            <div className="dropdown dropdown-end mx-5">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-primary shadow hover:scale-105 transition-transform"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden aspect-square border-2 border-primary shadow">
                  <img
                    alt="User Photo"
                    src={user.photoUrl}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-xl z-10 mt-3 w-56 p-3 shadow-lg border border-gray-100"
              >
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 font-medium text-primary hover:text-primary-focus"
                  >
                    <span>👤</span> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="flex items-center gap-2 font-medium text-primary hover:text-primary-focus"
                  >
                    <span>🤝</span> Connections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className="flex items-center gap-2 font-medium text-primary hover:text-primary-focus"
                  >
                    <span>📨</span> Requests
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={handleLogout}
                    className="flex items-center gap-2 font-semibold text-error hover:bg-error/10 hover:text-error rounded-lg px-2 transition-colors"
                  >
                    <span>🚪</span> Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
