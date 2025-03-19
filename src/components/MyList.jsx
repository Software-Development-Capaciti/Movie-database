import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getUserList, removeFromUserList } from "../utils/localStorage";

function MyList() {
  const [myList, setMyList] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect if not signed in
      return;
    }
    const list = getUserList(user.uid);
    setMyList(list);
  }, [user, navigate]);

  const handleRemove = (movieId) => {
    removeFromUserList(user.uid, movieId);
    setMyList(getUserList(user.uid)); // Update UI
  };

  if (!user) return null;

  return (
    <div className="bg-dark text-white min-h-screen py-5">
      <div className="container">
        <h1 className="text-center mb-5" style={{ marginTop: "80px" }}>
          My List
        </h1>
        {myList.length === 0 ? (
          <p className="text-center">Your list is empty. Add some movies!</p>
        ) : (
          <div className="row">
            {myList.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="col-6 col-md-4 col-lg-3 mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="card bg-secondary text-white"
                >
                  <img src={movie.img} className="card-img-top" alt={movie.title} />
                  <div className="card-body text-center">
                    <p className="card-text">{movie.title}</p>
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => handleRemove(movie.id)}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyList;