
import pickle
import asyncio
import re
import aiohttp
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
api_key = os.getenv("TMDB_API_KEY")


movies = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

_poster_cache: dict = {}
_details_cache: dict = {}

FALLBACK_POSTER = "https://placehold.co/500x750?text=No+Poster"


def make_connector():
    return aiohttp.TCPConnector(ssl=False, limit=50, ttl_dns_cache=300)


def clean_title(title: str) -> str:
    t = re.sub(r'\s*\(\d{4}\)', '', title)
    return t.strip().rstrip('.,!?;:')


async def tmdb_search_single(session: aiohttp.ClientSession, query: str, title_lower: str):
    """Single TMDB search query — returns best match or None."""
    try:
        async with session.get(
            "https://api.themoviedb.org/3/search/movie",
            params={"api_key": api_key, "query": query, "language": "en-US"},
            timeout=aiohttp.ClientTimeout(total=5),  # 8s se 5s kar diya
        ) as r:
            if r.status != 200:
                return None, []
            data = await r.json()
            results = data.get("results", [])
            if not results:
                return None, []

            q_lower = query.lower()
            # Exact match with poster
            for m in results:
                mt = m.get("title", "").lower()
                mo = m.get("original_title", "").lower()
                if (mt == title_lower or mt == q_lower or mo == title_lower or mo == q_lower):
                    if m.get("poster_path"):
                        return m, []
            # Exact match without poster
            for m in results:
                mt = m.get("title", "").lower()
                mo = m.get("original_title", "").lower()
                if (mt == title_lower or mt == q_lower or mo == title_lower or mo == q_lower):
                    return m, []
            return None, results
    except Exception:
        return None, []
    
    


async def tmdb_search(session: aiohttp.ClientSession, title: str):
    print("Searching movie:", title)
    cleaned = clean_title(title)
    words = cleaned.split()
    short = " ".join(words[:3]) if len(words) > 3 else None
    queries = list(dict.fromkeys(filter(None, [title, cleaned, short])))
    title_lower = cleaned.lower()

    all_results = []
    for q in queries:
        match, fallback = await tmdb_search_single(session, q, title_lower)
        if match:
            return match
        all_results.extend(fallback)

    if all_results:
        with_poster = [m for m in all_results if m.get("poster_path")]
        if with_poster:
            return max(with_poster, key=lambda m: m.get("popularity", 0))
        return max(all_results, key=lambda m: m.get("popularity", 0))
    return None


# Semaphore — parallel TMDB calls limit
_tmdb_semaphore = asyncio.Semaphore(10)


async def fetch_poster_async(session: aiohttp.ClientSession, movie_title: str):
    if movie_title in _poster_cache:
        return _poster_cache[movie_title]
    if not api_key:
        return FALLBACK_POSTER

    try:
        async with _tmdb_semaphore:
            match = await tmdb_search(session, movie_title)
        if match and match.get("poster_path"):
            url = "https://image.tmdb.org/t/p/w500" + match["poster_path"]
            _poster_cache[movie_title] = url
            return url
    except Exception as e:
        print("POSTER ERROR:", movie_title, str(e))

    _poster_cache[movie_title] = FALLBACK_POSTER
    return FALLBACK_POSTER


async def fetch_tmdb_recommendations_async(session: aiohttp.ClientSession, movie_title: str):
    if not api_key:
        return [], []
    try:
        match = await tmdb_search(session, movie_title)
        if not match:
            return [], []
        async with session.get(
            f"https://api.themoviedb.org/3/movie/{match['id']}/recommendations",
            params={"api_key": api_key, "language": "en-US"},
            timeout=aiohttp.ClientTimeout(total=10),
        ) as r:
            data = await r.json()
            movies_list = data.get("results", [])
        recommendations, posters = [], []
        for m in movies_list[:24]:
            recommendations.append(m["title"])
            p = m.get("poster_path")
            posters.append("https://image.tmdb.org/t/p/w500" + p if p else FALLBACK_POSTER)
        return recommendations, posters
    except Exception:
        return [], []


@app.get("/")
def home():
    return {"message": "CineMatch API Running"}


@app.get("/suggest/{query}")
def suggest_movies(query: str):
    try:
        matches = (
            movies[
                movies["title"].str.lower().str.contains(query.lower().strip(), na=False)
            ]["title"]
            .head(8)
            .tolist()
        )
        return {"suggestions": matches}
    except Exception as e:
        return {"error": str(e)}


@app.get("/recommend/{movie_name}")
async def recommend(movie_name: str):
    try:
        movie_name_clean = movie_name.lower().strip()
        matched_movie = movies[movies["title"].str.lower().str.strip() == movie_name_clean]

        async with aiohttp.ClientSession(
            connector=make_connector(),
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
        ) as session:

            if not matched_movie.empty:
                
                movie_index = matched_movie.index[0]
                distances = similarity[movie_index]
                movies_list = sorted(
                    enumerate(distances), reverse=True, key=lambda x: x[1]
                )[1:25]
                titles = [movies.iloc[i[0]].title for i in movies_list]
                selected_title = matched_movie.iloc[0].title

                # ✅ FIX: Saare titles ke posters ek saath fetch karo (no extra /posters call)
                poster_tasks = [fetch_poster_async(session, selected_title)] + \
                               [fetch_poster_async(session, t) for t in titles]

                results = await asyncio.gather(*poster_tasks, return_exceptions=True)

                searched_poster = results[0] if isinstance(results[0], str) else FALLBACK_POSTER
                all_fetched_posters = [
                    p if isinstance(p, str) else FALLBACK_POSTER
                    for p in results[1:]
                ]

                return {
                    "searched_movie": selected_title,
                    "searched_poster": searched_poster,
                    "recommendations": titles[:6],
                    "all_recommendations": titles,
                    "posters": all_fetched_posters[:6],
                    "all_posters": all_fetched_posters,  # ✅ saare posters already fetched
                    "source": "ML + TMDB",
                    "total": len(titles),
                }

            # TMDB fallback
            res = await asyncio.gather(
                fetch_poster_async(session, movie_name),
                fetch_tmdb_recommendations_async(session, movie_name),
                return_exceptions=True,
            )
            searched_poster = res[0] if isinstance(res[0], str) else FALLBACK_POSTER
            tmdb_recs, tmdb_posters = res[1] if isinstance(res[1], tuple) else ([], [])

            return {
                "searched_movie": movie_name,
                "searched_poster": searched_poster,
                "recommendations": tmdb_recs[:6],
                "all_recommendations": tmdb_recs,
                "posters": tmdb_posters[:6],
                "all_posters": tmdb_posters,
                "source": "TMDB only",
                "total": len(tmdb_recs),
            }

    except Exception as e:
        return {"error": str(e)}


@app.get("/posters")
async def get_posters(titles: str):
    """
    Fetch posters for a comma-separated list of movie titles.
    (Still available as a utility endpoint — frontend no longer calls this automatically)
    Example: /posters?titles=Inception,The Dark Knight,Interstellar
    """
    title_list = [t.strip() for t in titles.split(",") if t.strip()]
    if not title_list:
        return {"posters": []}

    async with aiohttp.ClientSession(
        connector=make_connector(),
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
    ) as session:
        results = await asyncio.gather(
            *[fetch_poster_async(session, t) for t in title_list],
            return_exceptions=True,
        )

    posters = [p if isinstance(p, str) else FALLBACK_POSTER for p in results]
    return {"titles": title_list, "posters": posters}


@app.get("/details/{movie_name}")
async def get_movie_details(movie_name: str):
    cache_key = movie_name.lower().strip()
    if cache_key in _details_cache:
        return _details_cache[cache_key]

    if not api_key:
        return {"error": "API key not found"}

    try:
        async with aiohttp.ClientSession(
            connector=make_connector(),
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
        ) as session:
            match = await tmdb_search(session, movie_name)
            if not match:
                return {"error": f"Movie '{movie_name}' not found on TMDB"}

            tmdb_id = match["id"]
            async with session.get(
                f"https://api.themoviedb.org/3/movie/{tmdb_id}",
                params={
                    "api_key": api_key,
                    "language": "en-US",
                    "append_to_response": "credits",
                },
                timeout=aiohttp.ClientTimeout(total=10),
            ) as r:
                detail = await r.json()

            if "id" not in detail:
                return {"error": "Could not load movie details from TMDB"}

        poster = (
            "https://image.tmdb.org/t/p/w500" + detail["poster_path"]
            if detail.get("poster_path") else FALLBACK_POSTER
        )
        backdrop = (
            "https://image.tmdb.org/t/p/w1280" + detail["backdrop_path"]
            if detail.get("backdrop_path") else ""
        )
        genres = [g["name"] for g in detail.get("genres", [])]
        cast_raw = detail.get("credits", {}).get("cast", [])[:8]
        cast = [
            {
                "name": c["name"],
                "character": c.get("character", ""),
                "photo": (
                    "https://image.tmdb.org/t/p/w185" + c["profile_path"]
                    if c.get("profile_path") else ""
                ),
            }
            for c in cast_raw
        ]
        crew = detail.get("credits", {}).get("crew", [])
        director = next((p["name"] for p in crew if p.get("job") == "Director"), "N/A")
        languages = [
            l.get("english_name", l.get("name", ""))
            for l in detail.get("spoken_languages", [])
        ]
        runtime = detail.get("runtime") or 0
        runtime_str = f"{runtime // 60}h {runtime % 60}m" if runtime else "N/A"
        release_date = detail.get("release_date", "")
        release_year = release_date[:4] if release_date else "N/A"

        result = {
            "title": detail.get("title", movie_name),
            "tagline": detail.get("tagline", ""),
            "overview": detail.get("overview", "No overview available."),
            "poster": poster,
            "backdrop": backdrop,
            "release_year": release_year,
            "runtime": runtime_str,
            "rating": round(detail.get("vote_average", 0), 1),
            "vote_count": detail.get("vote_count", 0),
            "genres": genres,
            "cast": cast,
            "director": director,
            "languages": languages,
            "budget": detail.get("budget", 0),
            "revenue": detail.get("revenue", 0),
        }

        _details_cache[cache_key] = result
        return result

    except Exception as e:
        return {"error": str(e)}






    # venv\Scripts\activate
    # uvicorn main:app --reload