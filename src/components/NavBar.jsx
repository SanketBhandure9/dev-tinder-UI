import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LOGOUT_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useState, useRef } from "react";

const NavBar = () => {
  const menuPanelRef = useRef();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleOverlayClick = (e) => {
    if (menuPanelRef.current && !menuPanelRef.current.contains(e.target)) {
      setMobileMenuOpen(false);
    }
  };

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    {
      to: "/feed",
      label: "Feed",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h18M3 12h18M3 19h18"
          />
        </svg>
      ),
    },
    {
      to: "/connections",
      label: "Connections",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-4a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"
          />
        </svg>
      ),
    },
    {
      to: "/requests",
      label: "Requests",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 3h-6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
          />
        </svg>
      ),
    },
    {
      to: "/profile",
      label: "Profile",
      icon: (
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A9.004 9.004 0 0 1 12 15c2.21 0 4.21.802 5.879 2.137M15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"
          />
        </svg>
      ),
    },
  ];

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
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Link
              to="/feed"
              className="flex items-center gap-3 group select-none"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-yellow-400 shadow-md ring-2 ring-orange-300 group-hover:scale-105 transition-transform">
                <span className="text-2xl">🔥</span>
              </span>
              <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight group-hover:brightness-110 transition">
                Dev Tinder
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-2 py-2 lg:px-3 rounded-lg transition font-semibold text-base ${
                  location.pathname.startsWith(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 lg:px-3 rounded-lg transition font-semibold text-base text-error hover:bg-error/10 hover:text-error"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12h4"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
            {/* Avatar Dropdown */}
            {user && (
              <div className="dropdown dropdown-end ml-2 lg:ml-4">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border border-primary shadow hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden border-2 border-primary shadow">
                    <img
                      alt="User Photo"
                      src={user.photoUrl}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-xl z-10 mt-3 w-64 p-0 shadow-lg border border-gray-100"
                >
                  {/* User Info */}
                  <li className="flex flex-col items-center gap-1 py-4 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow mb-2">
                      <img
                        alt="User Photo"
                        src={user.photoUrl}
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                    <span className="font-semibold text-gray-900 text-base">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[12rem]">
                      {user.email || user.username || ""}
                    </span>
                  </li>
                  {/* Profile */}
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition"
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A9.004 9.004 0 0 1 12 15c2.21 0 4.21.802 5.879 2.137M15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"
                        />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  {/* Settings (placeholder) */}
                  <li>
                    <button
                      className="flex items-center gap-3 px-4 py-2 font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition cursor-not-allowed opacity-60"
                      disabled
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                        />
                      </svg>
                      Settings
                    </button>
                  </li>
                  {/* Divider */}
                  <li className="my-1 border-t border-gray-100"></li>
                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 font-semibold text-error hover:bg-error/10 hover:text-error rounded-lg transition w-full"
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12h4"
                        />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center ml-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-circle"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-orange-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={handleOverlayClick}
        >
          <div
            ref={menuPanelRef}
            className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-lg animate-fade-in-down"
          >
            <div className="flex flex-col gap-1 px-4 pt-4 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition font-semibold text-lg ${
                    location.pathname.startsWith(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition font-semibold text-lg text-error hover:bg-error/10 hover:text-error"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12h4"
                  />
                </svg>
                <span>Logout</span>
              </button>
              {user && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow">
                    <img
                      alt="User Photo"
                      src={user.photoUrl}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <span className="font-medium text-gray-700 text-base truncate">
                    {user.firstName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
