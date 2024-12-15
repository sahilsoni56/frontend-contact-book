import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const Login = () => {
  const { toast } = useContext(ToastContext);
  const { loginUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter all the required fields!");
      return;
    }

    try {
      const success = await loginUser(credentials);
      if (success) {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      if (error?.response?.status === 500) {
        setError("Server error. Please try again later.");
        toast.error("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Login</h3>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            id="emailInput"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="johndoe@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            id="passwordInput"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Enter Password"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-[#612D3A] text-white font-semibold rounded-md hover:bg-[#431b25] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={error}
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#612D3A] hover:underline">
            Create One
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
