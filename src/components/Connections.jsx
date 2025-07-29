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
    <div className="flex flex-col flex-1 min-h-0 justify-center items-center w-full">
      {/* <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-pink-500 via-red-400 to-yellow-400 bg-clip-text text-transparent drop-shadow">
        Connections
      </h1> */}
      <div className="flex justify-center items-center w-full">
        <CardCarousel
          items={connections}
          renderCard={(connection) =>
            connection && connection._id ? (
              <UserCard
                user={connection}
                key={connection._id}
                hideActions={true}
                showRemoveConnection={true}
                showChatButton={true}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default Connections;
