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
    <div className="flex flex-col flex-1 min-h-0 justify-center items-center w-full">
      {/* <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-pink-500 via-red-400 to-yellow-400 bg-clip-text text-transparent drop-shadow">
        Requests
      </h1> */}
      <div className="flex justify-center items-center w-full">
        <CardCarousel
          items={requests}
          showPagination={false}
          renderCard={(request) => (
            <div className="relative w-full max-w-md mx-auto flex flex-col items-center pb-16">
              <UserCard
                user={request.fromUserId}
                isPreview={false}
                hideActions={false}
                onUserAction={(status) =>
                  reviewRequests(
                    status === "interested" ? "accepted" : "rejected",
                    request._id
                  )
                }
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Requests;
