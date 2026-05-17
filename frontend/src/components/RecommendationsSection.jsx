import SkeletonCard from "./SkeletonCard";
import MovieCard from "./MovieCard";

export default function RecommendationsSection({
  loading,
  visibleRecs,
  visiblePosters,
  allRecommendations,
  source,
  hasMore,
  nextStep,
  visibleCount,
  recsRef,
  onMoreClick,
  onOpenModal,
}) {
  return (
    <section className="recs-section" ref={recsRef}>
      <div className="section-header">
        <span className="section-title">Recommended Movies</span>
        <div className="section-line" />
        {!loading && source && (
          <span className={`rec-source-label ${source === "ML + TMDB" ? "ml" : "tmdb"}`}>
            {source === "ML + TMDB" ? "🤖 ML Model" : "🌐 TMDB"}
          </span>
        )}
        {!loading && (
          <span className="section-count">
            {visibleRecs.length} / {allRecommendations.length} results
          </span>
        )}
      </div>

      <div className="movie-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleRecs.map((title, i) => (
              <MovieCard
                key={i}
                title={title}
                poster={visiblePosters[i]}
                index={i}
                onOpenModal={onOpenModal}
              />
            ))
        }
      </div>

      {!loading && hasMore && (
        <div className="more-btn-wrap">
          <button className="more-btn" onClick={onMoreClick}>
            <span className="more-btn-icon">＋</span>
            More like this
            <span className="more-btn-count">
              +{Math.min(nextStep, allRecommendations.length) - visibleCount} more
            </span>
          </button>
        </div>
      )}
    </section>
  );
}