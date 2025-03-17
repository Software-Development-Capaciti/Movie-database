import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const StarRating = ({ rating, onRate }) => {
  const stars = Array(5)
    .fill(false)
    .map((_, index) => index < rating);
    

  return (
    <div className="star-rating">
      {stars.map((filled, index) => (
        <span
          key={index}
          className={`star ${filled ? "filled" : ""}`}
          onClick={() => onRate(index + 1)}
          style={{
            color: filled ? "#ffcc00" : "#ddd",
            cursor: "pointer",
            fontSize: "40px",
          }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

function CategoryDetail() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [rating, setRating] = useState(0); // State for rating
  const { categoryId } = useParams();
  const { state } = useLocation();
  const categoryTitle = state?.categoryTitle || "Category";
  const searchQuery = state?.searchQuery || null;
  const genreId = state?.genreId || null;
  const API_KEY = "af4905a1355138ebdf953acefa15cd9f";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

  const getEndpoint = () => {
    if (searchQuery) {
      let endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=${page}`;
      if (genreId) {
        endpoint += `&with_genres=${genreId}`;
      }
      return endpoint;
    }
    if (categoryId.startsWith("genre-")) {
      const genreId = categoryId.replace("genre-", "");
      return `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=${page}`;
    }
    switch (categoryId) {
      case "trending":
        return `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`;
      case "new-releases":
        return `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
      case "popular":
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
      default:
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const endpoint = getEndpoint();
        const response = await axios.get(endpoint);
        const newMovies = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          img: `${IMAGE_BASE_URL}${movie.poster_path}`,
        }));
        setMovies((prev) => [...prev, ...newMovies]);
      } catch (error) {
        console.error(`Error fetching movies for ${categoryTitle}:`, error);
      }
    };

    fetchMovies();
  }, [categoryId, page, searchQuery, genreId]);

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
        console.error("Error fetching movie details or trailer:", error);
        setMovieDetails(null);
        setTrailerKey(null);
      }
    };

    fetchMovieDetails();
  }, [selectedMovie]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setMovieDetails(null);
    setTrailerKey(null);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
    setTrailerKey(null);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = () => {
    console.log("Submitting rating:", rating);
  };

  return (
    <div className="bg-dark text-white min-h-screen py-5">
      <div className="container">
        <h1 className="text-center mb-5" style={{ marginTop: "80px" }}>
          {categoryTitle}
        </h1>
        <div className="row">
          {movies.map((movie, index) => (
            <div key={`${categoryId}-${index}`} className="col-6 col-md-4 col-lg-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ duration: 0.3 }}
                className="card bg-secondary text-white"
                style={{ cursor: "pointer" }}
                onClick={() => handleMovieClick(movie)}
              >
                <img src={movie.img} className="card-img-top" alt={movie.title} />
                <div className="card-body text-center">
                  <p className="card-text">{movie.title}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleLoadMore}>
            Load More
          </button>
        </div>

        {/* Modal for movie details and trailer */}
        {selectedMovie && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={handleCloseModal}
          >
            <div
              className="modal-dialog modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content bg-dark text-white">
                <div className="modal-header border-0">
                  <h5 className="modal-title">{selectedMovie.title}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {movieDetails ? (
                    <>
                      {trailerKey ? (
                        <div className="mb-3">
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                            title={`${selectedMovie.title} Trailer`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <p className="mb-3">No trailer available.</p>
                      )}
                      <div className="d-flex">
                        <img
                          src={`${IMAGE_BASE_URL}${movieDetails.poster_path}`}
                          alt={movieDetails.title}
                          className="img-fluid rounded mb-3"
                          style={{ maxWidth: "200px", marginRight: "20px" }}
                        />
                        <div>
                          <p><strong>Overview:</strong> {movieDetails.overview}</p>
                          <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
                          <p><strong>Rating:</strong> {movieDetails.vote_average}/10</p>
                          <p><strong>Runtime:</strong> {movieDetails.runtime} minutes</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5>Rate this Movie</h5>
                        <StarRating rating={rating} onRate={handleRatingChange} />
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-danger" onClick={handleSubmitRating}>
                          Submit Rating
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>Loading details and trailer...</p>
                  )}
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
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
