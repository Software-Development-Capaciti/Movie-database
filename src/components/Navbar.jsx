import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logo from "../assets/popcorn-movie-cinema-svgrepo-com.svg";
import Auth from './Auth';

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
      >
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center text-danger fw-bold fs-2" to="/">
            <img
              src={logo}
              alt="Xstream Logo"
              style={{ height: "40px", width: "60px", marginRight: "10px" }}
            />
            XStream
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#">TV Shows</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/genres">Movies</Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/my-list">My List</Link>
                </li>
              )}
              <li className="nav-item ms-2">
                {user ? (
                  <div className="dropdown">
                    <button 
                      className="btn btn-dark dropdown-toggle d-flex align-items-center" 
                      type="button" 
                      data-bs-toggle="dropdown"
                    >
                      <div 
                        className="bg-danger rounded-circle me-2 d-flex align-items-center justify-content-center" 
                        style={{ width: '32px', height: '32px' }}
                      >
                        {user.email[0].toUpperCase()}
                      </div>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark">
                      <li>
                        <span className="dropdown-item-text text-light">
                          {user.email}
                        </span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">Settings</Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger" 
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => setShowAuth(true)}
                  >
                    Sign In
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </motion.nav>

      <Auth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
}

export default Navbar;