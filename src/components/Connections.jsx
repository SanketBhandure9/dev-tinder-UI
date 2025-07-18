import { useEffect, useState } from "react";
import { USER_CONNECTIONS_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import axios from "axios";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      const response = await axios.get(USER_CONNECTIONS_URL, {
        withCredentials: true,
      });
      // Log the response for debugging
      console.log("Connections API response:", response.data);
      let connectionsArr = response.data?.data;
      if (!Array.isArray(connectionsArr) && Array.isArray(response.data)) {
        connectionsArr = response.data;
      }
      if (!Array.isArray(connectionsArr)) {
        setError("Unexpected response format from server.");
        dispatch(addConnections([]));
        return;
      }
      dispatch(addConnections(connectionsArr));
      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to load connections."
      );
      dispatch(addConnections([]));
      console.error("Connections fetch error:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections && !error)
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error) {
    return (
      <div className="flex flex-col items-center my-16">
        <svg
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-error mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
          />
        </svg>
        <h1 className="font-bold text-xl text-error">{error}</h1>
        <button className="btn btn-primary mt-4" onClick={fetchConnections}>
          Retry
        </button>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center my-16">
        <svg
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-gray-400 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0ZM12 14v6m0 0H7m5 0h5"
          />
        </svg>
        <h1 className="font-bold text-xl text-gray-500">
          No connections found :(
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-2xl">Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          connection;
        return (
          <div key={_id} className="flex justify-center my-6">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 flex flex-col items-center border border-gray-200">
              <img
                src={photoUrl}
                alt={firstName + " " + lastName}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                {firstName} {lastName}
                {gender === "male" && (
                  <span className="ml-2 text-blue-400" title="Male">
                    ♂️
                  </span>
                )}
                {gender === "female" && (
                  <span className="ml-2 text-pink-400" title="Female">
                    ♀️
                  </span>
                )}
              </h2>
              {/* Skills Badges */}
              {connection.skills &&
              Array.isArray(
                connection.skills ? connection.skills : connection.skills?.split
              )
                ? (Array.isArray(connection.skills)
                    ? connection.skills
                    : connection.skills.split(",")
                  )
                    .filter((s) => !!s)
                    .slice(0, 5).length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      {(Array.isArray(connection.skills)
                        ? connection.skills
                        : connection.skills.split(",")
                      )
                        .filter((s) => !!s)
                        .slice(0, 5)
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="badge badge-lg rounded-full px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-100 to-pink-100 text-primary shadow border border-primary/20"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  )
                : null}
              <div className="text-gray-600 mb-2">
                Age: <span className="font-medium">{age}</span>
              </div>
              <div className="text-gray-500 italic mb-4 text-center">
                {about}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
