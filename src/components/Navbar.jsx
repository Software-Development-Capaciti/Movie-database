import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './Auth';
import './Navbar.css';
import xstreamIcon from '../assets/popcorn-movie-cinema-svgrepo-com.svg'; // Adjust path to your icon

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-danger fw-bold fs-2 d-flex align-items-center" to="/">
            <img 
              src={xstreamIcon} 
              alt="XStream Icon" 
              className="me-2" 
              style={{ width: '32px', height: '32px' }} // Adjust size as needed
            />
            Xstream
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show mobile-menu' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={() => setIsMenuOpen(false)}>TV Shows</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/genres" onClick={() => setIsMenuOpen(false)}>Movies</Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/my-list" onClick={() => setIsMenuOpen(false)}>My List</Link>
                </li>
              )}
              <li className="nav-item ms-2">
                {user ? (
                  <div className="dropdown">
                    <button 
                      className="btn btn-transparent dropdown-toggle d-flex align-items-center" 
                      type="button" 
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div 
                        className="bg-danger rounded-circle me-2 d-flex align-items-center justify-content-center" 
                        style={{ width: '32px', height: '32px' }}
                      >
                        {user.email[0].toUpperCase()}
                      </div>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                      <li>
                        <span className="dropdown-item-text text-light">
                          {user.email}
                        </span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger" 
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => {
                      setShowAuth(true);
                      setIsMenuOpen(false);
                    }}
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