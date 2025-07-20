import axios from "axios";
import { USER_SEND_REQUESTS_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";

const UserCard = ({ user, isPreview = false, hideActions = false }) => {
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

  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-6 flex flex-col items-center mx-auto my-4 transition-all hover:shadow-2xl">
      <div className="w-40 h-40 mt-1 mb-5">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full rounded-full object-cover border-4 border-primary ring-2 ring-offset-2 ring-primary"
        />
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-3 flex items-center gap-3">
        {firstName} {lastName}
        {gender === "male" && (
          <span className="text-blue-500 text-lg" title="Male">
            ♂️
          </span>
        )}
        {gender === "female" && (
          <span className="text-pink-500 text-lg" title="Female">
            ♀️
          </span>
        )}
      </h2>

      <div className="text-lg text-gray-600 mb-3">
        <span className="font-medium">Age:</span> {age}
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
        <div className="flex gap-4 mt-2">
          <button
            className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
            onClick={() => handleUserAction("ignored", _id)}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Ignore
          </button>

          <button
            className="bg-green-500 text-white hover:bg-green-600 font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2 shadow"
            onClick={() => handleUserAction("interested", _id)}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Interested
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
