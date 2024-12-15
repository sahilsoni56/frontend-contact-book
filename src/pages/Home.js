import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AllContact from "./AllContact";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-gray-800">Welcome {user ? user.name : null}</h1>
      <hr className="my-4 border-t-2 border-gray-300" />
      <AllContact />
    </div>
  );
};

export default Home;
