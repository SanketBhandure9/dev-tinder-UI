import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("tara@harale.com");
  const [password, setPassword] = useState("Taraa@06");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await axios.post(
        LOGIN_URL,
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(result.data));
      navigate("/feed");
    } catch (err) {
      setError(err.response.data);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center my-20">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="text"
                className="input"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
