import { useState } from "react";

export default function PosterImg({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const isPlaceholder = !src || src.includes("placehold.co");

  if (isPlaceholder) {
    return (
      <div className="no-poster">
        <span className="no-poster-icon">🎞️</span>
        <span>No Poster</span>
      </div>
    );
  }

  return (
    <img
      className={`${className} ${loaded ? "loaded" : ""}`}
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentNode.innerHTML = `<div class="no-poster"><span class="no-poster-icon">🎞️</span><span>No Poster</span></div>`;
      }}
    />
  );
}