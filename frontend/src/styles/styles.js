const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #e50914;
    --red-dark: #b0060f;
    --gold: #f5c518;
    --bg: #0a0a0a;
    --surface: #141414;
    --surface2: #1c1c1c;
    --border: rgba(255,255,255,0.07);
    --text: #f0f0f0;
    --muted: #888;
    --skeleton-base: #1a1a1a;
    --skeleton-shine: #252525;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; min-height: 100vh; }

  .app { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }

  .app::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 300px;
    background: radial-gradient(ellipse at 20% 0%, rgba(229,9,20,0.15) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 0%, rgba(245,197,24,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px 60px; position: relative; z-index: 1; }

  .nav { display: flex; align-items: center; gap: 12px; padding: 32px 0 48px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
  .nav-icon { font-size: 28px; filter: drop-shadow(0 0 12px rgba(229,9,20,0.6)); animation: pulse 3s ease-in-out infinite; margin-top: 6px; }
  @keyframes pulse {
    0%, 100% { filter: drop-shadow(0 0 12px rgba(229,9,20,0.6)); }
    50% { filter: drop-shadow(0 0 20px rgba(229,9,20,0.9)); }
  }
  .nav-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 5px; background: linear-gradient(90deg, #fff 60%, var(--red)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-top: 1.125rem;}
  .nav-badge { margin-left: auto; font-size: 11px; font-weight: 500; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-top: 1.125rem; }

  .search-section { margin-bottom: 56px; }
  .search-label { font-size: 12px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; display: block; }
  .search-row { display: flex; gap: 12px; align-items: stretch; position: relative; }
  .search-wrap { position: relative; flex: 1; max-width: 480px; }
  .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 16px; pointer-events: none; }
  .search-input { width: 100%; padding: 16px 16px 16px 46px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
  .search-input::placeholder { color: var(--muted); }
  .search-input:focus { border-color: var(--red); background: var(--surface2); box-shadow: 0 0 0 3px rgba(229,9,20,0.12); }

  .suggestions { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; z-index: 100; box-shadow: 0 20px 40px rgba(0,0,0,0.6); animation: slideDown 0.15s ease; }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .suggestion-item { padding: 13px 16px; cursor: pointer; font-size: 14px; color: #ccc; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; transition: background 0.15s, color 0.15s; }
  .suggestion-item:last-child { border-bottom: none; }
  .suggestion-item:hover { background: rgba(229,9,20,0.12); color: #fff; }
  .suggestion-item::before { content: '🎬'; font-size: 12px; opacity: 0.6; }

  .search-btn { padding: 0 28px; background: var(--red); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; white-space: nowrap; box-shadow: 0 4px 20px rgba(229,9,20,0.3); }
  .search-btn:hover { background: #ff1a27; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(229,9,20,0.45); }
  .search-btn:active { transform: translateY(0); }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ===================== SKELETON ===================== */
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  .skeleton-base {
    background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 4px;
  }

  .skeleton-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .skeleton-poster {
    aspect-ratio: 2/3;
    width: 100%;
    background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  .skeleton-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  .skeleton-num { height: 10px; width: 28px; background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%); background-size: 600px 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: 4px; }
  .skeleton-title { height: 13px; width: 80%; background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%); background-size: 600px 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: 4px; }
  .skeleton-title-short { height: 13px; width: 55%; background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%); background-size: 600px 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: 4px; }

  .skeleton-card:nth-child(2) .skeleton-poster,
  .skeleton-card:nth-child(2) .skeleton-num,
  .skeleton-card:nth-child(2) .skeleton-title,
  .skeleton-card:nth-child(2) .skeleton-title-short { animation-delay: 0.1s; }
  .skeleton-card:nth-child(3) .skeleton-poster,
  .skeleton-card:nth-child(3) .skeleton-num,
  .skeleton-card:nth-child(3) .skeleton-title,
  .skeleton-card:nth-child(3) .skeleton-title-short { animation-delay: 0.2s; }
  .skeleton-card:nth-child(4) .skeleton-poster,
  .skeleton-card:nth-child(4) .skeleton-num,
  .skeleton-card:nth-child(4) .skeleton-title,
  .skeleton-card:nth-child(4) .skeleton-title-short { animation-delay: 0.3s; }
  .skeleton-card:nth-child(5) .skeleton-poster,
  .skeleton-card:nth-child(5) .skeleton-num,
  .skeleton-card:nth-child(5) .skeleton-title,
  .skeleton-card:nth-child(5) .skeleton-title-short { animation-delay: 0.4s; }
  .skeleton-card:nth-child(6) .skeleton-poster,
  .skeleton-card:nth-child(6) .skeleton-num,
  .skeleton-card:nth-child(6) .skeleton-title,
  .skeleton-card:nth-child(6) .skeleton-title-short { animation-delay: 0.5s; }

  /* ===================== LAYOUT ===================== */
  .section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; flex-wrap: wrap; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 2px; color: #fff; }
  .section-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }
  .section-count { font-size: 12px; color: var(--muted); letter-spacing: 1px; }

  .selected-section { margin-bottom: 56px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .selected-card { display: flex; gap: 28px; align-items: flex-start; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; max-width: 420px; position: relative; overflow: hidden; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
  .selected-card:hover { border-color: rgba(229,9,20,0.5); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .selected-card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: linear-gradient(180deg, var(--red), var(--red-dark)); border-radius: 3px 0 0 3px; }
  .selected-poster { width: 100px; border-radius: 8px; flex-shrink: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
  .selected-info { flex: 1; }
  .selected-tag { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--red); margin-bottom: 8px; display: block; }
  .selected-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 1px; line-height: 1.2; color: #fff; margin-bottom: 10px; }
  .selected-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .click-hint { font-size: 11px; color: var(--red); margin-top: 10px; opacity: 0.8; }

  .recs-section { animation: fadeIn 0.5s ease 0.1s both; }
  .movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }

  .movie-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s; cursor: pointer; animation: fadeIn 0.4s ease both; position: relative; }
  .movie-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.6); border-color: rgba(229,9,20,0.4); }
  .movie-card:hover .card-overlay { opacity: 1; }
  .card-poster-wrap { position: relative; aspect-ratio: 2/3; overflow: hidden; background: var(--surface2); }
  .card-poster { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
  .movie-card:hover .card-poster { transform: scale(1.05); }
  .card-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(229,9,20,0.2) 0%, transparent 60%); opacity: 0; transition: opacity 0.25s; }
  .no-poster { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--muted); font-size: 12px; }
  .no-poster-icon { font-size: 32px; opacity: 0.4; }
  .card-body { padding: 12px; }
  .card-num { font-size: 10px; font-weight: 600; letter-spacing: 2px; color: var(--red); margin-bottom: 4px; display: block; }
  .card-title { font-size: 13px; font-weight: 500; line-height: 1.4; color: #ddd; }

  .movie-card:nth-child(1) { animation-delay: 0.05s; }
  .movie-card:nth-child(2) { animation-delay: 0.1s; }
  .movie-card:nth-child(3) { animation-delay: 0.15s; }
  .movie-card:nth-child(4) { animation-delay: 0.2s; }
  .movie-card:nth-child(5) { animation-delay: 0.25s; }
  .movie-card:nth-child(6) { animation-delay: 0.3s; }
  .movie-card:nth-child(7) { animation-delay: 0.35s; }
  .movie-card:nth-child(8) { animation-delay: 0.4s; }
  .movie-card:nth-child(9) { animation-delay: 0.45s; }
  .movie-card:nth-child(10) { animation-delay: 0.5s; }
  .movie-card:nth-child(11) { animation-delay: 0.55s; }
  .movie-card:nth-child(12) { animation-delay: 0.6s; }

  /* ===================== MORE LIKE THIS BUTTON ===================== */
  .more-btn-wrap { display: flex; justify-content: center; margin-top: 36px; }
  .more-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    background: transparent;
    border: 1.5px solid rgba(229,9,20,0.5);
    border-radius: 50px;
    color: #e0e0e0;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .more-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(229,9,20,0.15), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .more-btn:hover { border-color: var(--red); color: #fff; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(229,9,20,0.25); }
  .more-btn:hover::before { opacity: 1; }
  .more-btn:active { transform: translateY(0); }
  .more-btn-icon { font-size: 18px; transition: transform 0.3s; }
  .more-btn:hover .more-btn-icon { transform: rotate(180deg); }
  .more-btn-count { font-size: 11px; color: var(--red); font-weight: 600; background: rgba(229,9,20,0.12); border: 1px solid rgba(229,9,20,0.3); padding: 2px 8px; border-radius: 12px; }

  /* ===================== MODAL ===================== */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayIn 0.25s ease; }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

  .modal { background: #181818; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 820px; max-height: 90vh; overflow-y: auto; position: relative; animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); scrollbar-width: thin; scrollbar-color: var(--red) transparent; }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.88) translateY(24px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal::-webkit-scrollbar { width: 4px; }
  .modal::-webkit-scrollbar-thumb { background: var(--red); border-radius: 4px; }

  .modal-backdrop { width: 100%; height: 240px; object-fit: cover; border-radius: 20px 20px 0 0; display: block; }
  .modal-backdrop-placeholder { width: 100%; height: 160px; background: linear-gradient(135deg, #1a1a1a, #2a0a0a); border-radius: 20px 20px 0 0; }

  .modal-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; z-index: 10; }
  .modal-close:hover { background: var(--red); transform: scale(1.1); }

  .modal-body { padding: 0 28px 28px; }
  .modal-header { display: flex; gap: 24px; margin-top: -60px; margin-bottom: 24px; align-items: flex-end; }
  .modal-poster { width: 110px; border-radius: 12px; flex-shrink: 0; box-shadow: 0 12px 32px rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.08); }

  .modal-title-block { flex: 1; padding-bottom: 4px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 2px; line-height: 1.1; color: #fff; margin-bottom: 6px; }
  .modal-tagline { font-size: 13px; color: var(--red); font-style: italic; margin-bottom: 10px; opacity: 0.9; }

  .modal-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .meta-pill { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #bbb; background: rgba(255,255,255,0.06); border: 1px solid var(--border); padding: 4px 10px; border-radius: 20px; }
  .meta-pill.rating { color: var(--gold); border-color: rgba(245,197,24,0.3); background: rgba(245,197,24,0.07); }

  .modal-divider { height: 1px; background: var(--border); margin: 20px 0; }
  .modal-overview { font-size: 14px; color: #bbb; line-height: 1.75; margin-bottom: 24px; }
  .modal-section-label { font-size: 10px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }

  .genres-wrap { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .genre-tag { font-size: 12px; padding: 5px 14px; border-radius: 20px; border: 1px solid rgba(229,9,20,0.35); color: #ddd; background: rgba(229,9,20,0.08); }

  .cast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .cast-card { text-align: center; }
  .cast-photo { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin: 0 auto 6px; display: block; border: 2px solid var(--border); }
  .cast-photo-placeholder { width: 64px; height: 64px; border-radius: 50%; background: var(--surface2); margin: 0 auto 6px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 2px solid var(--border); }
  .cast-name { font-size: 11px; font-weight: 500; color: #ccc; line-height: 1.3; }
  .cast-char { font-size: 10px; color: var(--muted); margin-top: 2px; }

  .info-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .info-item { flex: 1; min-width: 130px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; }
  .info-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .info-value { font-size: 14px; font-weight: 500; color: #e0e0e0; }

  .modal-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; gap: 16px; color: var(--muted); font-size: 14px; }
  .modal-spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--red); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .modal-error { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; gap: 12px; color: var(--muted); font-size: 14px; text-align: center; }
  .modal-error-icon { font-size: 40px; opacity: 0.5; }
  .modal-error-text { color: #aaa; }

  /* Source badges */
  .source-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; margin-top: 8px; }
  .source-badge.ml { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4); color: #a5b4fc; }
  .source-badge.tmdb { background: rgba(1,180,228,0.12); border: 1px solid rgba(1,180,228,0.35); color: #67e8f9; }
  .rec-source-label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 20px; }
  .rec-source-label.ml { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; }
  .rec-source-label.tmdb { background: rgba(1,180,228,0.1); border: 1px solid rgba(1,180,228,0.28); color: #67e8f9; }

  /* Poster image fade-in */
  .card-poster { opacity: 0; transition: opacity 0.4s ease, transform 0.3s ease; }
  .card-poster.loaded { opacity: 1; }

  /* Responsive */
  @media (max-width: 600px) {
    .movie-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
    .modal-header { flex-direction: column; align-items: flex-start; margin-top: 16px; }
    .modal-poster { width: 80px; }
    .more-btn { padding: 12px 24px; font-size: 13px; }
  }
`;

export default styles;