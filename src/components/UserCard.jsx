import axios from "axios";
import { USER_SEND_REQUESTS_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";

const UserCard = ({
  user,
  isPreview = false,
  hideActions = false,
  onUserAction,
}) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, photoUrl, about } = user;

  const handleUserAction = async (status, userId) => {
    try {
      await axios.post(
        `${USER_SEND_REQUESTS_URL}/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request error:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Unknown error occurred while sending request."
      );
    }
  };

  // Allow parent to override action handlers (for requests)
  const handleAction = (status) => {
    if (typeof onUserAction === "function") {
      onUserAction(status);
    } else {
      handleUserAction(status, _id);
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-6 flex flex-col items-center mx-auto my-4 transition-all hover:shadow-2xl">
      <div className="w-40 h-40 mt-1 mb-5">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full rounded-full object-cover border-4 border-primary ring-2 ring-offset-2 ring-primary"
        />
      </div>

      <div className="flex items-end justify-center gap-2 mb-3 flex-wrap">
        <span className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
          {firstName} {lastName}
        </span>
        <span
          className="text-base sm:text-lg text-gray-400 font-medium align-baseline"
          style={{ marginBottom: "2px" }}
        >
          {age}
        </span>
        {gender === "male" && (
          <span
            className="text-blue-500 text-base sm:text-lg align-baseline"
            style={{ marginBottom: "2px" }}
            title="Male"
          >
            ♂️
          </span>
        )}
        {gender === "female" && (
          <span
            className="text-pink-500 text-base sm:text-lg align-baseline"
            style={{ marginBottom: "2px" }}
            title="Female"
          >
            ♀️
          </span>
        )}
      </div>

      {about && (
        <p className="text-lg text-gray-500 text-center italic mb-3 px-4">
          {about.length > 100 ? `${about.slice(0, 100)}...` : about}
        </p>
      )}

      {user.skills && Array.isArray(user.skills) && user.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {user.skills.map((skill, idx) => (
            <span
              key={idx}
              className="badge badge-lg px-3 py-1 bg-blue-100 text-primary border border-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {!isPreview && !hideActions && (
        <div className="flex gap-6 mt-2">
          {/* Ignore (cross) button */}
          <button
            className="w-12 h-12 mt-2 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 border-2 border-red-200 text-red-600 shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Ignore"
            onClick={() => handleAction("ignored")}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="12" fill="#fee2e2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 8l8 8M16 8l-8 8"
                stroke="#dc2626"
              />
            </svg>
          </button>

          {/* Interested (heart) button */}
          <button
            className="w-12 h-12 mt-2 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 border-2 border-green-200 text-green-600 shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Interested"
            onClick={() => handleAction("interested")}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="12" fill="#bbf7d0" />
              <path
                d="M16.5 8.5C16.5 7.11929 15.3807 6 14 6C13.0411 6 12.2344 6.59489 12 7.4375C11.7656 6.59489 10.9589 6 10 6C8.61929 6 7.5 7.11929 7.5 8.5C7.5 12.5 12 15 12 15C12 15 16.5 12.5 16.5 8.5Z"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#22c55e"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
