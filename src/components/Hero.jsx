import { motion } from "framer-motion";
import ReactPlayer from "react-player";

function Hero() {
  return (
    <section className="position-relative vh-100">
      {/* Trailer Video */}
      <ReactPlayer
        url="https://www.youtube.com/watch?v=vICUPlr3EEI&pp=ygUhZXhwbGljaXQgbW92aWUgdHJhaWxlciBmb3IgYWR1bHRz" // trailer URL
        playing
        muted
        loop
        width="100%"
        height="100%"
        className="position-absolute top-0 start-0 object-fit-cover"
      />
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-start p-5">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="display-1 fw-bold text-white"
        >
          Welcome to Xstream
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lead text-white mt-3"
        >
          Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="btn btn-danger btn-lg mt-4"
        >
          Start Watching
        </motion.button>
      </div>
    </section>
  );
}

export default Hero;