import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Add Firebase auth
import axios from "axios";
import { addToUserList, isMovieInList, removeFromUserList } from "../utils/localStorage"; // Import utils

function GenreDetail() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const { genreId } = useParams();
  const { state } = useLocation();
  const genreName = state?.genreName || "Genre";
  const API_KEY = "af4905a1355138ebdf953acefa15cd9f";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser; // Get current user

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=${page}`
        );
        const newMovies = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          img: `${IMAGE_BASE_URL}${movie.poster_path}`,
        }));
        setMovies((prev) => [...prev, ...newMovies]);
      } catch (error) {
        console.error(`Error fetching movies for genre ${genreName}:`, error);
      }
    };

    fetchMovies();
  }, [genreId, page]);

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
    console.log("Movie clicked for modal:", movie.title);
    setSelectedMovie(movie);
    setMovieDetails(null);
    setTrailerKey(null);
  };

  const handleViewMore = (movieId, movieTitle) => {
    console.log("View More clicked for:", movieTitle, "Navigating to:", `/movies/${movieId}/similar`);
    navigate(`/movies/${movieId}/similar`, { state: { movieTitle } });
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
    setTrailerKey(null);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleToggleList = (movie) => {
    if (!user) {
      alert("Please sign in to add movies to your list.");
      return;
    }
    const isInList = isMovieInList(user.uid, movie.id);
    if (isInList) {
      removeFromUserList(user.uid, movie.id);
    } else {
      addToUserList(user.uid, { id: movie.id, title: movie.title, img: movie.img });
    }
  };

  return (
    <div className="bg-dark text-white min-h-screen py-5">
      <div className="container">
        <h1 className="text-center mb-5" style={{ marginTop: "80px" }}>
          {genreName} Movies
        </h1>
        <div className="row">
          {movies.map((movie, index) => (
            <div key={`${genreId}-${index}`} className="col-6 col-md-4 col-lg-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ duration: 0.3 }}
                className="card bg-secondary text-white"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={movie.img}
                  className="card-img-top"
                  alt={movie.title}
                  onClick={() => handleMovieClick(movie)}
                />
                <div className="card-body text-center">
                  <p className="card-text">{movie.title}</p>
                  <button
                    className="btn btn-danger btn-sm mt-2 me-2"
                    onClick={() => handleViewMore(movie.id, movie.title)}
                  >
                    View More
                  </button>
                  {user && (
                    <button
                      className={`btn btn-sm mt-2 ${isMovieInList(user.uid, movie.id) ? 'btn-outline-danger' : 'btn-success'}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleToggleList(movie);
                      }}
                    >
                      {isMovieInList(user.uid, movie.id) ? 'Remove' : 'Add to List'}
                    </button>
                  )}
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

export default GenreDetail;