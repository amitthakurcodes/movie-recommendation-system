export default function SearchSection({
  movie,
  suggestions,
  loading,
  error,
  onInputChange,
  onSearch,
  onSuggestionClick,
}) {
  return (
    <section className="search-section">
      <span className="search-label">Find your next watch</span>
      <div className="search-row">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search a movie..."
            value={movie}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((item, i) => (
                <div key={i} className="suggestion-item" onClick={() => onSuggestionClick(item)}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="search-btn" onClick={() => onSearch()} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "8px", color: "#ff6b6b", fontSize: "13px" }}>
          ⚠️ {error}
        </div>
      )}
    </section>
  );
}