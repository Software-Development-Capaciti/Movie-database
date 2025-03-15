import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

function ContentRow({ title }) {
  const [movies, setMovies] = useState([]);
  const API_KEY = "af4905a1355138ebdf953acefa15cd9f"; // Replace with your TMDb API key
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300"; // TMDb image base URL

  // Map the title to an appropriate TMDb endpoint
  const getEndpoint = (title) => {
    switch (title) {
      case "Trending Now":
        return `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
      case "New Releases":
        return `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
      case "Xstream Originals":
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`; // Example endpoint
      default:
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(getEndpoint(title));
        // Limit to 6 movies for display
        const movieData = response.data.results.slice(0, 6).map((movie) => ({
          title: movie.title,
          img: `${IMAGE_BASE_URL}${movie.poster_path}`,
        }));
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
        // Fallback to placeholder data if API fails
        setMovies(
          Array(6).fill({
            title: "Sample Movie",
            img: "https://via.placeholder.com/300x450",
          })
        );
      }
    };

    fetchMovies();
  }, [title]); // Re-fetch when title changes

  return (
    <section className="py-4 px-3">
      <h2 className="h3 fw-bold text-white mb-3">{title}</h2>
      <div className="d-flex overflow-auto pb-3" style={{ scrollbarWidth: "none" }}>
        {movies.map((movie, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, y: -10 }}
            transition={{ duration: 0.3 }}
            className="card bg-secondary text-white me-3"
            style={{ minWidth: "200px" }}
          >
            <img src={movie.img} className="card-img-top" alt={movie.title} />
            <div className="card-body text-center">
              <p className="card-text">{movie.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ContentRow;