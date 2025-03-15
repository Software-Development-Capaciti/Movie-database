import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentRow from "./components/ContentRow";
import GenreMovies from "./components/GenreMovies";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;