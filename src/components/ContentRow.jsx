import { motion } from "framer-motion";

function ContentRow({ title }) {
  const cards = Array(6).fill({
    title: "Sample Movie",
    img: "https://via.placeholder.com/300x450", // Replace with real images
  });

  return (
    <section className="py-4 px-3">
      <h2 className="h3 fw-bold text-white mb-3">{title}</h2>
      <div className="d-flex overflow-auto pb-3" style={{ scrollbarWidth: "none" }}>
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, y: -10 }}
            transition={{ duration: 0.3 }}
            className="card bg-secondary text-white me-3"
            style={{ minWidth: "200px" }}
          >
            <img src={card.img} className="card-img-top" alt={card.title} />
            <div className="card-body text-center">
              <p className="card-text">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ContentRow;