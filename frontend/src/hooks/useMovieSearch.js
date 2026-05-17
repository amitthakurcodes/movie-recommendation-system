

import { useState, useRef } from "react";
import { API, STEPS } from "../constants";

export function useMovieSearch() {
  const [movie, setMovie] = useState("");
  const [searchedMovie, setSearchedMovie] = useState("");
  const [searchedPoster, setSearchedPoster] = useState("");
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [allPosters, setAllPosters] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const recsRef = useRef(null);
  const suggestTimeout = useRef(null);

  const getSuggestions = async (text) => {
    setMovie(text);
    if (text.length < 2) { setSuggestions([]); return; }

    clearTimeout(suggestTimeout.current);
    suggestTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/suggest/${encodeURIComponent(text)}`);
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      }
    }, 200);
  };

  const getRecommendations = async (selected = movie) => {
    if (!selected.trim()) return;
      setMovie(selected); 
    setLoading(true);
    setError("");
    setSuggestions([]);
    setVisibleCount(6);
    setAllRecommendations([]);
    setAllPosters([]);
    setSearchedMovie("");
    setSearchedPoster("");

    try {
      const res = await fetch(`${API}/recommend/${encodeURIComponent(selected.trim())}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSearchedMovie(data.searched_movie);
        setSearchedPoster(data.searched_poster || "");

        // ✅ FIX: Backend already returns all_posters fully fetched — use directly, no extra /posters call
        const allRecs = data.all_recommendations || data.recommendations || [];
        const allPostersFromServer = data.all_posters || data.posters || [];

        setAllRecommendations(allRecs);
        setAllPosters(allPostersFromServer);
        setSource(data.source || "");

        setTimeout(() => {
          recsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (e) {
      setError(e.message || "Could not connect to backend. Is it running?");
    }

    setLoading(false);
  };

  const nextStep = STEPS.find((s) => s > visibleCount);
  const hasMore = nextStep !== undefined && visibleCount < allRecommendations.length;

  const handleMoreClick = () => {
    if (nextStep) setVisibleCount(nextStep);
  };

  const openModal = async (title) => {
    setModalOpen(true);
    setModalData(null);
    setModalLoading(true);
    try {
      const res = await fetch(`${API}/details/${encodeURIComponent(title)}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      // ✅ FIX: Properly handle error vs valid data
      if (data.error) {
        setModalData({ _error: data.error });
      } else if (!data.title) {
        setModalData({ _error: "Movie details not found." });
      } else {
        setModalData(data);
      }
    } catch (e) {
      setModalData({ _error: e.message || "Could not fetch movie details" });
    }
    setModalLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const formatMoney = (n) => {
    if (!n) return "N/A";
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
    return `$${n.toLocaleString()}`;
  };

  const visibleRecs = allRecommendations.slice(0, visibleCount);
  const visiblePosters = allPosters.slice(0, visibleCount);

  return {
    movie, setMovie,
    searchedMovie, searchedPoster,
    allRecommendations, visibleRecs,
    allPosters, visiblePosters,
    suggestions, setSuggestions,
    source, loading, error,
    visibleCount, hasMore, nextStep,
    modalOpen, modalData, modalLoading,
    recsRef,
    getSuggestions,
    getRecommendations,
    handleMoreClick,
    openModal,
    closeModal,
    formatMoney,
  };
}