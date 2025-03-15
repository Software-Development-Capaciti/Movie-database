import { motion } from "framer-motion";
import logo from "../assets/logo.jpg"; // Adjust the path based on where you place your logo file

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center text-danger fw-bold fs-2" href="#">
          <img
            src={logo}
            alt="Xstream Logo"
            style={{ height: "40px", width: "60px", marginRight: "10px" }}
          />
          Xstream
        </a>
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
              <a className="nav-link text-light" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">TV Shows</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">Movies</a>
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