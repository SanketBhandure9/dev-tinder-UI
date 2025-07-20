import axios from "axios";
import {
  USER_REQUESTS_URL,
  USER_REVIEW_REQUESTS_URL,
} from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import CardCarousel from "./CardCarousel";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const response = await axios.get(USER_REQUESTS_URL, {
        withCredentials: true,
      });
      dispatch(addRequests(response.data.data));
    } catch (err) {
      if (err?.response?.status === 404) {
        dispatch(addRequests([]));
      }
    }
  };

  const reviewRequests = async (status, _id) => {
    try {
      await axios.post(
        USER_REVIEW_REQUESTS_URL + `/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      // Update index safely
      if (index > 0) setIndex(index - 1);
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests)
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (requests.length === 0) {
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
          No connection requests found :(
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center my-4 mt-4">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-pink-500 via-red-400 to-yellow-400 bg-clip-text text-transparent drop-shadow">
        Requests
      </h1>
      <CardCarousel
        items={requests}
        showPagination={false}
        renderCard={(request) => (
          <div className="w-full max-w-md mx-auto flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <UserCard user={request.fromUserId} hideActions={true} />
            </div>
            <div className="flex gap-4 mt-2 mb-2 justify-center w-full">
              <button
                className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-3 text-base shadow-md"
                onClick={() => reviewRequests("rejected", request._id)}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
              <button
                className="bg-green-500 text-white hover:bg-green-600 font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-3 text-base shadow-md"
                onClick={() => reviewRequests("accepted", request._id)}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Requests;
