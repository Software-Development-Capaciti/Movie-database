import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentRow from "./components/ContentRow";

function App() {
  return (
    <div className="bg-dark text-white min-h-screen">
      <Navbar />
      <Hero />
      <ContentRow title="Trending Now" />
      <ContentRow title="New Releases" />
      <ContentRow title="Xstream Originals" />
    </div>
  );
}

export default App;