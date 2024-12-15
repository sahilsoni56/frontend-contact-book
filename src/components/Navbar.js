import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const Navbar = ({ title = "Contact-Book" }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    toast.success("Logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-[#612D3A] text-[#CACEB8]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold font-serif">
          {title}
        </Link>

        <button
          className="lg:hidden text-[#CACEB8] focus:outline-none"
          type="button"
          aria-controls="navbarMenu"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className=" lg:flex space-x-6">
          <ul className="flex items-center space-x-6">
            {user ? (
              <>
                <li>
                  <Link to="/create" className="text-[#CACEB8] hover:text-gray-300">
                    Add Contact
                  </Link>
                </li>
                <li>
                  <button
                    className="text-[#612D3A]  bg-[#CACEB8] hover:bg-[#c4d286] px-3 py-2 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-[#CACEB8] hover:text-gray-300">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-[#CACEB8] hover:text-gray-300">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
