import { useEffect, useState } from "react";
import { USER_CONNECTIONS_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import CardCarousel from "./CardCarousel";
import axios from "axios";
import UserCard from "./UserCard";

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
    <div className="text-center my-6">
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-block bg-gradient-to-tr from-pink-500 via-red-400 to-yellow-400 bg-clip-text text-transparent">
            <svg
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-pink-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 1 0-8 0c0 4.418 4 8 4 8s4-3.582 4-8zM12 11v.01"
              />
            </svg>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-pink-500 via-red-400 to-yellow-400 bg-clip-text text-transparent drop-shadow">
            Connections
          </h1>
        </div>
        <div className="h-1 w-24 mt-2 rounded-full bg-gradient-to-r from-pink-400 via-red-300 to-yellow-300 opacity-70"></div>
      </div>
      <CardCarousel
        items={connections}
        renderCard={(connection) => (
          <UserCard user={connection} key={connection._id} hideActions={true} />
        )}
      />
    </div>
  );
};

export default Connections;
