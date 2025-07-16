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
    if (feed) return;
    try {
      const response = await axios.get(USER_FEED_URL, {
        withCredentials: true,
      });

      dispatch(addFeed(response.data));
    } catch (err) {}
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;

  if (feed.length === 0) {
    return (
      <h1 className="flex justify-center font-bold text-xl my-10">
        No more users :(
      </h1>
    );
  }

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed.data[0]} />
      </div>
    )
  );
};

export default Feed;
