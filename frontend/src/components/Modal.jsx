export default function Modal({ modalOpen, modalData, modalLoading, onClose, formatMoney }) {
  if (!modalOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {modalLoading && (
          <div className="modal-loading">
            <div className="modal-spinner" />
            Loading movie details...
          </div>
        )}

        {modalData?._error && !modalLoading && (
          <div className="modal-error">
            <span className="modal-error-icon">⚠️</span>
            <span className="modal-error-text">{modalData._error}</span>
          </div>
        )}

        {modalData && !modalData._error && !modalLoading && (
          <>
            {modalData.backdrop
              ? <img className="modal-backdrop" src={modalData.backdrop} alt={modalData.title} />
              : <div className="modal-backdrop-placeholder" />
            }
            <div className="modal-body">
              <div className="modal-header">
                <img className="modal-poster" src={modalData.poster} alt={modalData.title} />
                <div className="modal-title-block">
                  <div className="modal-title">{modalData.title}</div>
                  {modalData.tagline && (
                    <div className="modal-tagline">"{modalData.tagline}"</div>
                  )}
                  <div className="modal-meta">
                    {modalData.rating > 0 && (
                      <span className="meta-pill rating">⭐ {modalData.rating} / 10</span>
                    )}
                    {modalData.release_year !== "N/A" && (
                      <span className="meta-pill">📅 {modalData.release_year}</span>
                    )}
                    {modalData.runtime !== "N/A" && (
                      <span className="meta-pill">⏱ {modalData.runtime}</span>
                    )}
                    {modalData.director !== "N/A" && (
                      <span className="meta-pill">🎥 {modalData.director}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-divider" />
              <p className="modal-overview">{modalData.overview}</p>

              {modalData.genres?.length > 0 && (
                <>
                  <div className="modal-section-label">Genres</div>
                  <div className="genres-wrap">
                    {modalData.genres.map((g, i) => (
                      <span key={i} className="genre-tag">{g}</span>
                    ))}
                  </div>
                </>
              )}

              {modalData.cast?.length > 0 && (
                <>
                  <div className="modal-section-label">Cast</div>
                  <div className="cast-grid">
                    {modalData.cast.map((c, i) => (
                      <div key={i} className="cast-card">
                        {c.photo
                          ? <img className="cast-photo" src={c.photo} alt={c.name} />
                          : <div className="cast-photo-placeholder">🎭</div>
                        }
                        <div className="cast-name">{c.name}</div>
                        <div className="cast-char">{c.character}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="modal-divider" />
              <div className="info-row">
                {modalData.languages?.length > 0 && (
                  <div className="info-item">
                    <div className="info-label">Languages</div>
                    <div className="info-value">{modalData.languages.join(", ")}</div>
                  </div>
                )}
                {modalData.budget > 0 && (
                  <div className="info-item">
                    <div className="info-label">Budget</div>
                    <div className="info-value">{formatMoney(modalData.budget)}</div>
                  </div>
                )}
                {modalData.revenue > 0 && (
                  <div className="info-item">
                    <div className="info-label">Box Office</div>
                    <div className="info-value">{formatMoney(modalData.revenue)}</div>
                  </div>
                )}
                {modalData.vote_count > 0 && (
                  <div className="info-item">
                    <div className="info-label">Total Votes</div>
                    <div className="info-value">{modalData.vote_count.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}