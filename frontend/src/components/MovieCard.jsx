import PosterImg from "./PosterImg";

export default function MovieCard({ title, poster, index, onOpenModal }) {
  return (
    <div className="movie-card" onClick={() => onOpenModal(title)}>
      <div className="card-poster-wrap">
        <PosterImg src={poster} alt={title} className="card-poster" />
        <div className="card-overlay" />
      </div>
      <div className="card-body">
        <span className="card-num">#{String(index + 1).padStart(2, "0")}</span>
        <div className="card-title">{title}</div>
      </div>
    </div>
  );
}