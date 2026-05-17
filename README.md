# 🎬 CineMatch — AI-Powered Movie Recommendation System

<p align="center">
  <img src="https://github.com/user-attachments/assets/634a9b2a-bc49-42f1-9071-84059308a882" width="900"/>
</p>

> **Live Demo:** [movie-recommendation-system-green-seven.vercel.app](https://movie-recommendation-system-green-seven.vercel.app)

CineMatch is a full-stack movie recommendation web app that combines a **Machine Learning similarity model** with the **TMDB API** to suggest movies you'll actually want to watch — complete with posters, cast, ratings, and full movie details.

---

## 📸 Features

- 🔍 **Smart Search** with real-time autocomplete suggestions
- 🤖 **ML-based Recommendations** using cosine similarity on movie metadata
- 🌐 **TMDB Fallback** for movies not in the local dataset
- 🎭 **Movie Detail Modal** — poster, backdrop, cast, genres, runtime, budget, box office
- 🖼️ **Poster Loading** with skeleton shimmer animations
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop
- ⚡ **Async Parallel Fetching** — all posters fetched simultaneously for speed
- 💾 **In-memory Caching** — repeated searches return instantly

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| Plain CSS-in-JS | Custom dark theme styling |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| aiohttp | Async HTTP client for TMDB calls |
| scikit-learn | Cosine similarity ML model |
| pickle | Serialized movie & similarity data |
| TMDB API | Movie posters, details, cast |
| Render | Deployment |

---

## 📁 Project Structure

```
movie-recommendation-system/
│
├── frontend/                        # React + Vite app
│   └── src/
│       ├── App.jsx                  # Root component — layout glue
│       ├── constants/
│       │   └── index.js             # API URL, STEPS config
│       ├── styles/
│       │   └── styles.js            # Full CSS-in-JS theme
│       ├── hooks/
│       │   └── useMovieSearch.js    # All state + fetch logic
│       └── components/
│           ├── Navbar.jsx
│           ├── SearchSection.jsx
│           ├── SelectedMovie.jsx
│           ├── RecommendationsSection.jsx
│           ├── MovieCard.jsx
│           ├── SkeletonCard.jsx
│           ├── PosterImg.jsx
│           └── Modal.jsx
│
├── backend/                         # FastAPI app
│   ├── main.py                      # All API routes
│   ├── movies.pkl                   # Serialized movie dataset
│   ├── similarity.pkl               # Precomputed cosine similarity matrix
│   ├── .env                         # TMDB API key (not committed)
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ How It Works

### 1. ML Recommendation Engine
- Movie metadata (title, genres, cast, crew, keywords, overview) is combined into a single text "tag" per movie
- Tags are vectorized using **CountVectorizer**
- **Cosine similarity** is computed between all movie vectors
- Top 24 most similar movies are returned for any query

### 2. TMDB Integration
- Each recommended title is searched on TMDB to fetch its poster
- All poster fetches happen **in parallel** using `asyncio.gather`
- A semaphore (max 8 concurrent) prevents API rate limiting
- Results are **cached in-memory** so repeated searches are instant

### 3. Fallback Strategy
- If a movie isn't in the local dataset → TMDB's own recommendation endpoint is used
- If TMDB can't find a poster → a clean placeholder is shown

---

## 🚀 Local Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

---

### Backend Setup

```bash
# 1. Go to backend folder
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
echo TMDB_API_KEY=your_api_key_here > .env

# 5. Start the server
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

---

### Frontend Setup

```bash
# 1. Go to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo VITE_API_URL=http://127.0.0.1:8000 > .env

# 4. Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🌐 API Endpoints

### `GET /`
Health check.
```json
{ "message": "CineMatch API Running" }
```

---

### `GET /suggest/{query}`
Returns up to 8 autocomplete suggestions.

**Example:** `/suggest/inc`
```json
{
  "suggestions": ["Inception", "Incendies", "The Incredible Hulk"]
}
```

---

### `GET /recommend/{movie_name}`
Returns 24 recommended movies with posters.

**Example:** `/recommend/Inception`
```json
{
  "searched_movie": "Inception",
  "searched_poster": "https://image.tmdb.org/t/p/w500/...",
  "recommendations": ["Looper", "Interstellar", ...],
  "all_recommendations": ["Looper", "Interstellar", ...],
  "posters": ["https://...", ...],
  "all_posters": ["https://...", ...],
  "source": "ML + TMDB",
  "total": 24
}
```

---

### `GET /details/{movie_name}`
Returns full movie details for the modal.

**Example:** `/details/Inception`
```json
{
  "title": "Inception",
  "tagline": "Your mind is the scene of the crime.",
  "overview": "...",
  "poster": "https://...",
  "backdrop": "https://...",
  "release_year": "2010",
  "runtime": "2h 28m",
  "rating": 8.4,
  "vote_count": 35000,
  "genres": ["Action", "Science Fiction", "Adventure"],
  "cast": [{ "name": "Leonardo DiCaprio", "character": "Cobb", "photo": "https://..." }],
  "director": "Christopher Nolan",
  "languages": ["English", "Japanese", "French"],
  "budget": 160000000,
  "revenue": 836836967
}
```

---

## 🚢 Deployment

### Frontend → Vercel
```bash
# In frontend folder
npm run build

# Push to GitHub, connect repo on vercel.com
# Set environment variable:
# VITE_API_URL = https://your-backend.onrender.com
```

### Backend → Render
1. Push backend folder to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add environment variable: `TMDB_API_KEY = your_key`

---

## 📦 Requirements

### `requirements.txt`
```
fastapi
uvicorn
aiohttp
python-dotenv
pandas
scikit-learn
```

---

## 🔮 Possible Future Improvements

- [ ] User accounts and saved watchlists
- [ ] Filter by genre, year, rating
- [ ] Trailer embed via YouTube API
- [ ] "More like this" from the modal itself
- [ ] Redis caching for production-scale speed
- [ ] Collaborative filtering (user-based recommendations)

---

## 🙏 Credits

- Movie dataset — [TMDB 5000 Movie Dataset](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata) via Kaggle
- Poster & details — [The Movie Database (TMDB)](https://www.themoviedb.org)
- ML approach inspired by content-based filtering techniques

---

## 👨‍💻 Author

Amitchand Thakur

GitHub:
https://github.com/amitthakurcodes

---

<p align="center">✨ Built with ❤️ by Amit | <a href="https://movie-recommendation-system-green-seven.vercel.app">Live Demo</a></p>
