import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "./Style/UpcomingPage.css";

const UpcomingPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const apiKey = "c45a857c193f6302f2b5061c3b85e743";

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`
        );
        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch upcoming movies. Please try again later.");
        setLoading(false);
      }
    };

    if (!isSearching) {
      fetchUpcomingMovies();
    }
  }, [page, isSearching]);

  const handleSearch = async (searchResults) => {
    if (searchResults.length > 0) {
      setMovies(searchResults);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <NavBar onSearch={handleSearch} />

      <div className="upcoming-page">
        <h1>{isSearching ? "Search Results" : "Upcoming Movies"}</h1>
        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/path/to/placeholder.jpg"
                  }
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p>
                    Rating: {movie.vote_average ? movie.vote_average : "N/A"}
                  </p>
                  <p>Release Date: {movie.release_date}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming movies available.</p>
          )}
        </div>

        {!isSearching && (
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UpcomingPage;
