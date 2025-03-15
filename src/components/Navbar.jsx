import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Add this import
import logo from "../assets/popcorn-movie-cinema-svgrepo-com.svg"; // Adjust the path based on where you place your logo file

function Navbar() {
  return (
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
          Xstream
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">TV Shows</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/genres">Movies</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">My List</a>
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;