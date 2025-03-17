import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function CategoryDetail() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [rating, setRating] = useState(0);
  const { categoryId } = useParams();
  const { state } = useLocation();
  const categoryTitle = state?.categoryTitle || "Category";
  const API_KEY = "af4905a1355138ebdf953acefa15cd9f";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";
  const JSON_SERVER_URL = "http://localhost:5000/ratings";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [page]);

  useEffect(() => {
    if (!selectedMovie) return;

    const fetchMovieDetails = async () => {
      try {
        const detailsResponse = await axios.get(
          `${BASE_URL}/movie/${selectedMovie.id}?api_key=${API_KEY}&language=en-US`
        );
        setMovieDetails(detailsResponse.data);

        const videosResponse = await axios.get(
          `${BASE_URL}/movie/${selectedMovie.id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const trailer = videosResponse.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [selectedMovie]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setMovieDetails(null);
    setTrailerKey(null);
    setRating(0);
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    try {
      await axios.post(JSON_SERVER_URL, {
        movieId: selectedMovie.id,
        title: selectedMovie.title,
        rating: rating,
      });
      alert("Rating submitted successfully!");
      setSelectedMovie(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="bg-dark text-white min-h-screen py-5">
      <div className="container">
        <h1 className="text-center mb-5" style={{ marginTop: "80px" }}>{categoryTitle}</h1>
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="card bg-secondary text-white"
                style={{ cursor: "pointer" }}
                onClick={() => handleMovieClick(movie)}
              >
                <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                <div className="card-body text-center">
                  <p className="card-text">{movie.title}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        {selectedMovie && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content bg-dark text-white">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedMovie.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedMovie(null)}></button>
                </div>
                <div className="modal-body">
                  {movieDetails ? (
                    <>
                      {trailerKey && (
                        <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${trailerKey}`} title="Trailer"></iframe>
                      )}
                      <p><strong>Overview:</strong> {movieDetails.overview}</p>
                      <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
                      <p><strong>Rating:</strong> {movieDetails.vote_average}/10</p>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} onClick={() => setRating(star)} style={{ cursor: "pointer", fontSize: "24px" }}>
                            {star <= rating ? "\u2605" : "\u2606"}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>Loading movie details...</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleRatingSubmit}>Submit Rating</button>
                  <button className="btn btn-secondary" onClick={() => setSelectedMovie(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryDetail;
