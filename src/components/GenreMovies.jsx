import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Add Firebase auth
import axios from "axios";
import {
  addToUserList,
  isMovieInList,
  removeFromUserList,
} from "../utils/localStorage"; // Import utils

function GenreMovies() {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const API_KEY = "af4905a1355138ebdf953acefa15cd9f";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser; // Get current user

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const fetchedGenres = response.data.genres;
        setGenres(fetchedGenres);
        fetchMoviesForAllGenres(fetchedGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const fetchMoviesForAllGenres = async (genresList) => {
    const moviesData = {};

    for (const genre of genresList) {
      try {
        const response = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&language=en-US&page=1`
        );
        const movieData = response.data.results.slice(0, 6).map((movie) => ({
          id: movie.id,
          title: movie.title,
          img: `${IMAGE_BASE_URL}${movie.poster_path}`,
        }));
        moviesData[genre.id] = movieData;
      } catch (error) {
        console.error(`Error fetching movies for genre ${genre.name}:`, error);
        moviesData[genre.id] = [];
      }
    }

    setMoviesByGenre(moviesData);
  };

  const handleViewMore = (genreId, genreName) => {
    console.log("Navigating to CategoryDetail for genre:", genreName, genreId);
    navigate(`/category/genre-${genreId}`, {
      state: { categoryTitle: `${genreName} Movies` },
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log(
      "Searching for:",
      searchQuery,
      "with genre:",
      selectedGenre || "All"
    );
    navigate("/search", {
      state: {
        searchQuery,
        genreId: selectedGenre || null,
        categoryTitle: `Search Results for "${searchQuery}"`,
      },
    });
  };

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

  const handleToggleList = (movie) => {
    if (!user) {
      alert("Please sign in to add movies to your list.");
      return;
    }
    const isInList = isMovieInList(user.uid, movie.id);
    if (isInList) {
      removeFromUserList(user.uid, movie.id);
    } else {
      addToUserList(user.uid, {
        id: movie.id,
        title: movie.title,
        img: movie.img,
      });
    }
  };

  return (
    <div className="bg-dark text-white min-h-screen py-5">
      <div className="container">
        <h1 className="text-center mb-5" style={{ marginTop: "80px" }}>
          Movies by Genre
        </h1>

        <form onSubmit={handleSearch} className="mb-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4 col-lg-3 mb-3">
              <select
                className="form-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 col-lg-2">
              <button type="submit" className="btn btn-danger w-100">
                Search
              </button>
            </div>
          </div>
        </form>

        {genres.map((genre) => (
          <section key={genre.id} className="mb-5">
            <h2 className="h3 fw-bold text-white mb-3">{genre.name}</h2>
            <div
              className="d-flex overflow-auto pb-3"
              style={{ scrollbarWidth: "none" }}
            >
              {(moviesByGenre[genre.id] || []).map((movie, index) => (
                <motion.div
                  key={`${genre.id}-${index}`}
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="card bg-secondary text-white me-3"
                  style={{ minWidth: "200px", cursor: "pointer" }}
                  onClick={() => handleMovieClick(movie)}
                >
                  <img
                    src={movie.img}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body text-center">
                    <p className="card-text">{movie.title}</p>
                    {user && (
                      <button
                        className={`btn btn-sm mt-2 ${
                          isMovieInList(user.uid, movie.id)
                            ? "btn-outline-danger"
                            : "btn-danger"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleToggleList(movie);
                        }}
                      >
                        {isMovieInList(user.uid, movie.id)
                          ? "Remove"
                          : "Add to List"}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-3">
              <button
                className="btn btn-danger"
                onClick={() => handleViewMore(genre.id, genre.name)}
              >
                View More
              </button>
            </div>
          </section>
        ))}

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
                          <p>
                            <strong>Overview:</strong> {movieDetails.overview}
                          </p>
                          <p>
                            <strong>Release Date:</strong>{" "}
                            {movieDetails.release_date}
                          </p>
                          <p>
                            <strong>Rating:</strong> {movieDetails.vote_average}
                            /10
                          </p>
                          <p>
                            <strong>Runtime:</strong> {movieDetails.runtime}{" "}
                            minutes
                          </p>
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

export default GenreMovies;
