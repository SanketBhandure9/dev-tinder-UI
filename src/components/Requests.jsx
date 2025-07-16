import axios from "axios";
import {
  USER_REQUESTS_URL,
  USER_REVIEW_REQUESTS_URL,
} from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();
  const fetchRequests = async () => {
    try {
      const response = await axios.get(USER_REQUESTS_URL, {
        withCredentials: true,
      });
      dispatch(addRequests(response.data.data));
      console.log(response.data.data);
    } catch (err) {}
  };

  const reviewRequests = async (status, _id) => {
    try {
      const response = await axios.post(
        USER_REVIEW_REQUESTS_URL + `/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0) {
    return (
      <h1 className="flex justify-center my-10 font-bold text-xl">
        No requests found
      </h1>
    );
  }

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-2xl">Connection Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          request.fromUserId;
        return (
          <div key={_id} className="m-4 p-4 flex justify-center">
            <div className="card bg-neutral text-neutral-content w-96">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Cookies!</h2>
                <div className="card-actions justify-end">
                  <img className="w-20 h-20 object-cover" src={photoUrl} />
                  <h2>{firstName + " " + lastName}</h2>
                </div>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => reviewRequests("accepted", request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      reviewRequests("rejected", request._id);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
