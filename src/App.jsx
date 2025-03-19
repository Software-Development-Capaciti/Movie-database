import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentRow from "./components/ContentRow";
import GenreMovies from "./components/GenreMovies";
import GenreDetail from "./components/GenreDetail";
import CategoryDetail from "./components/CategoryDetail";
import MyList from "./components/MyList"; // Import MyList component

function App() {
  return (
    <Router>
      <div className="bg-dark text-white min-h-screen">
        <Navbar />
        <Routes>
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
          <Route path="/genres" element={<GenreMovies />} />
          <Route path="/genres/:genreId" element={<GenreDetail />} />
          <Route path="/category/:categoryId" element={<CategoryDetail />} />
          <Route path="/search" element={<CategoryDetail />} />
          <Route path="/my-list" element={<MyList />} /> {/* Add My List route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;