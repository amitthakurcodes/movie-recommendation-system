
import styles from "./styles/styles";
import { useMovieSearch } from "./hooks/useMovieSearch";

import Navbar from "./components/Navbar";
import SearchSection from "./components/SearchSection";
import SelectedMovie from "./components/SelectedMovie";
import RecommendationsSection from "./components/RecommendationsSection";
import Modal from "./components/Modal";

export default function App() {
  const {
    movie,
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
  } = useMovieSearch();

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="container">

          <Navbar />

          <SearchSection
            movie={movie}
            suggestions={suggestions}
            loading={loading}
            error={error}
            onInputChange={getSuggestions}
            onSearch={getRecommendations}
            onSuggestionClick={(item) => {
              setSuggestions([]);
              getRecommendations(item);
            }}
          />

          {searchedMovie && (
            <SelectedMovie
              searchedMovie={searchedMovie}
              searchedPoster={searchedPoster}
              source={source}
              onOpenModal={openModal}
            />
          )}

          {(loading || allRecommendations.length > 0) && (
            <RecommendationsSection
              loading={loading}
              visibleRecs={visibleRecs}
              visiblePosters={visiblePosters}
              allRecommendations={allRecommendations}
              source={source}
              hasMore={hasMore}
              nextStep={nextStep}
              visibleCount={visibleCount}
              recsRef={recsRef}
              onMoreClick={handleMoreClick}
              onOpenModal={openModal}
            />
          )}

        </div>
      </div>

      <Modal
        modalOpen={modalOpen}
        modalData={modalData}
        modalLoading={modalLoading}
        onClose={closeModal}
        formatMoney={formatMoney}
      />
    </>
  );
}






// venv\Scripts\activate

//uvicorn main:app --reload