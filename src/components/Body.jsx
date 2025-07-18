import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { PROFILE_VIEW_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const response = await axios.get(PROFILE_VIEW_URL, {
        withCredentials: true,
      });
      dispatch(addUser(response.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <div className="flex-shrink-0">
        <NavBar />
      </div>
      <main className="flex-grow flex flex-col items-center px-2 md:px-0 min-h-0 w-full">
        <Outlet />
      </main>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default Body;
