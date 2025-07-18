import axios from "axios";
import { USER_FEED_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const response = await axios.get(USER_FEED_URL, {
        withCredentials: true,
      });

      // Log and extract users array
      console.log("response", response.data);
      // If response.data is { data: [...] }, use response.data.data
      // If response.data is [...], use response.data
      const users = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      dispatch(addFeed(users));
    } catch (err) {}
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center my-16">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 mb-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0ZM12 14v6m0 0H7m5 0h5" /></svg>
        <h1 className="font-bold text-xl text-gray-500">No more users :(</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <div className="w-full max-w-md">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
