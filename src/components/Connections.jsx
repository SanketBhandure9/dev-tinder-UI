import { useEffect } from "react";
import { USER_CONNECTIONS_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import axios from "axios";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const response = await axios.get(USER_CONNECTIONS_URL, {
        withCredentials: true,
      });
      console.log(response.data.data);
      dispatch(addConnections(response.data.data));
    } catch (err) {
      // TODO Error
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return <h1 className="font-bold text-2xl">Connections</h1>;
  }

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-2xl">Connections</h1>
      {connections.map((connection) => {
        const { firstName, lastName, age, gender, about, photoUrl } =
          connection;
        return (
          <div className="m-4 p-4 flex justify-center">
            <div className="card bg-neutral text-neutral-content w-96">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Cookies!</h2>
                <div className="card-actions justify-end">
                  <img className="w-20 h-20 object-cover" src={photoUrl} />
                  <h2>{firstName + " " + lastName}</h2>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Accept</button>
                  <button className="btn btn-ghost">Reject</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
