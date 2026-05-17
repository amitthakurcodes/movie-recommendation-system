export default function SelectedMovie({ searchedMovie, searchedPoster, source, onOpenModal }) {
  return (
    <section className="selected-section">
      <div className="section-header">
        <span className="section-title">Selected Movie</span>
        <div className="section-line" />
      </div>
      <div className="selected-card" onClick={() => onOpenModal(searchedMovie)}>
        {searchedPoster && !searchedPoster.includes("placehold.co") ? (
          <img className="selected-poster" src={searchedPoster} alt={searchedMovie} />
        ) : (
          <div
            className="selected-poster"
            style={{ background: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", height: "150px", borderRadius: "8px" }}
          >
            <span style={{ fontSize: "32px", opacity: 0.3 }}>🎬</span>
          </div>
        )}
        <div className="selected-info">
          <span className="selected-tag">Now Finding Similar To</span>
          <div className="selected-name">{searchedMovie}</div>
          <div className="selected-desc">
            Based on genres, themes, and cast — we've curated the best matches for you below.
          </div>
          {source && (
            <span className={`source-badge ${source === "ML + TMDB" ? "ml" : "tmdb"}`}>
              {source === "ML + TMDB" ? "🤖 ML Model" : "🌐 TMDB"}
            </span>
          )}
          <div className="click-hint">👆 Click to see full details</div>
        </div>
      </div>
    </section>
  );
}