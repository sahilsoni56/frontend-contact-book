import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastContext from "./ToastContext";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const loginUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error && result.token) {
        Cookies.set("token", result.token, { expires: 7 });
        setUser(result);
        toast.success(`Logged in ${result.user.name}`, {
          position: "top-right",
          className: "bg-green-500 text-white p-3 rounded-md shadow-md",
        });
        navigate("/home", { replace: true });
      } else {
        setError("Invalid credentials. Please check your email and password.");
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again later.");
     
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error) {
        toast.success("User registered successfully! Login to your account.", {
          position: "top-right",
          className: "bg-blue-500 text-white p-3 rounded-md shadow-md",
        });
        navigate("/login", { replace: true });
      } else {
        toast.error(result.error, {
          position: "top-right",
          className: "bg-red-500 text-white p-3 rounded-md shadow-md",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkUserLoggedIn = () => {
    const token = Cookies.get("token");
    if (token) {
      fetch(`http://localhost:5000/api/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          if (!result.error) {
            setUser(result);
          } else {
            navigate("/login", { replace: true });
          }
        })
        .catch((err) => {
          console.error("Error checking user login:", err);
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export default AuthContext;
