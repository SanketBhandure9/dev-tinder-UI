import { useState } from "react";
import UserCard from "./UserCard";
import { PROFILE_EDIT_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [age, setAge] = useState(user.age);
  const [about, setAbout] = useState(user.about);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [showToast, setShowToast] = useState(false);

  //   const [skills, setSkills] = useState([]);
  console.log(user);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const response = await axios.post(
        PROFILE_EDIT_URL,
        { age, about, photoUrl },
        { withCredentials: true }
      );
      dispatch(addUser(response?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center my-20">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    type="number"
                    className="input"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About</legend>
                  <input
                    type="text"
                    className="input"
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Photo URL</legend>
                  <input
                    type="text"
                    className="input"
                    value={photoUrl}
                    onChange={(event) => setPhotoUrl(event.target.value)}
                  />
                </fieldset>
              </div>
              <p className="text-red-500">{error}</p>
              <div className="card-actions justify-center">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard user={{ ...user, age, about, photoUrl }} />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Data saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
