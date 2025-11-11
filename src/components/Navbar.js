import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-indigo-600 p-4 text-white">
      <a
        href="/"
        onClick={handleLogoClick}
        className="text-lg font-bold cursor-pointer"
      >
        MyApp
      </a>

      <div className="flex items-center gap-4 relative">
        {!user ? (
          <>
            <Link
              to="/login"
              className="hover:bg-indigo-500 px-3 py-1 rounded transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:bg-indigo-500 px-3 py-1 rounded transition"
            >
              Register
            </Link>
          </>
        ) : (
         <div className="relative">
            <div className="flex items-center gap-3">
              {/* Users link (left) */}
              <Link
                to="/users"
                className="whitespace-nowrap px-3 py-1 rounded hover:bg-indigo-500 transition"
              >
                Users
              </Link>

              {/* Avatar + name dropdown trigger (right of Users) */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 bg-indigo-700 px-3 py-1 rounded hover:bg-indigo-500 transition whitespace-nowrap"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm text-white truncate max-w-[140px] block pt-0.5">
                    Hi,{" "}
                    <span className="font-medium ml-1 inline-block max-w-[110px] align-middle">
                      {user?.name}
                    </span>
                  </span>

                  <svg
                    className={`w-4 h-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-lg border z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        )}
      </div>
    </nav>
  );
}

export default Navbar;
