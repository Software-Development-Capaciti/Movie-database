import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentRow from "./components/ContentRow";
import GenreMovies from "./components/GenreMovies";
import GenreDetail from "./components/GenreDetail";
import CategoryDetail from "./components/CategoryDetail";
import SimilarMovies from "./components/SimilarMovies"; 

function App() {
  return (
    <Router>
      <div className="bg-dark text-white min-h-screen">
        <Navbar />
        <Routes>
          {/* Homepage with Hero and ContentRows */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ContentRow title="Trending Now" />
                <ContentRow title="New Releases" />
                <ContentRow title="Xstream Originals" />
              </>
            }
          />
          {/* Genre Movies page */}
          <Route path="/genres" element={<GenreMovies />} />
          {/* Genre Detail page */}
          <Route path="/genres/:genreId" element={<GenreDetail />} />
          {/* Category Detail page */}
          <Route path="/category/:categoryId" element={<CategoryDetail />} />
          {/* Similar Movies page */}
          <Route path="/movies/:movieId/similar" element={<SimilarMovies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;