
const grid = document.getElementById("movieGrid");
const statusMessage = document.getElementById("statusMessage");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const resultCount = document.getElementById("resultCount");
const themeBtn = document.getElementById("themeBtn");
const favouritesBtn = document.getElementById("favouritesBtn");
const movieDialog = document.getElementById("movieDialog");
const movieDetails = document.getElementById("movieDetails");

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://placehold.co/400x600?text=No+Poster";

let currentMovies = [];
let showingFavourites = false;
let searchMode = false;

function getFavourites() {
    try {
        return JSON.parse(localStorage.getItem("cineScopeFavourites")) || [];
    } catch {
        return [];
    }
}

function isFavourite(id) {
    return getFavourites().some(movie => movie.id === id);
}

function toggleFavourite(movie) {
    let favourites = getFavourites();

    if (favourites.some(item => item.id === movie.id)) {
        favourites = favourites.filter(item => item.id !== movie.id);
    } else {
        favourites.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average
        });
    }

    localStorage.setItem("cineScopeFavourites", JSON.stringify(favourites));

    if (showingFavourites) {
        showFavourites();
    } else {
        renderMovies(currentMovies);
    }
}

async function apiRequest(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }

    return data;
}

async function loadPopular() {
    showingFavourites = false;
    searchMode = false;
    sectionTitle.textContent = "Popular Movies";
    statusMessage.hidden = false;
    statusMessage.textContent = "Loading movies...";
    resultCount.textContent = "";
    grid.innerHTML = "";

    try {
        const data = await apiRequest("/api/popular");
        currentMovies = data.results || [];
        renderMovies(currentMovies);
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

async function searchMovies(query) {
    showingFavourites = false;
    searchMode = true;
    sectionTitle.textContent = `Results for "${query}"`;
    statusMessage.hidden = false;
    statusMessage.textContent = "Searching...";
    resultCount.textContent = "";
    grid.innerHTML = "";

    try {
        const data = await apiRequest(
            `/api/search?query=${encodeURIComponent(query)}`
        );
        currentMovies = data.results || [];
        renderMovies(currentMovies);
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

function renderMovies(movies) {
    grid.innerHTML = "";
    resultCount.textContent = `${movies.length} movies`;
    statusMessage.hidden = movies.length > 0;
    statusMessage.textContent = movies.length
        ? ""
        : "No movies found. Try another title.";

    movies.forEach(movie => {
        const card = document.createElement("article");
        card.className = "movie-card";

        const poster = document.createElement("img");
        poster.className = "poster";
        poster.src = movie.poster_path
            ? IMAGE_URL + movie.poster_path
            : PLACEHOLDER;
        poster.alt = `${movie.title || "Movie"} poster`;
        poster.loading = "lazy";
        poster.addEventListener("error", () => {
            poster.src = PLACEHOLDER;
        }, { once: true });
        poster.addEventListener("click", () => showDetails(movie.id));

        const info = document.createElement("div");
        info.className = "movie-info";

        const title = document.createElement("h3");
        title.textContent = movie.title || "Untitled";

        const meta = document.createElement("p");
        meta.className = "movie-meta";
        const year = movie.release_date
            ? movie.release_date.slice(0, 4)
            : "Year unknown";
        const rating = Number(movie.vote_average || 0).toFixed(1);
        meta.textContent = `${year} · ★ ${rating}`;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const detailsBtn = document.createElement("button");
        detailsBtn.textContent = "Details";
        detailsBtn.addEventListener("click", () => showDetails(movie.id));

        const favouriteBtn = document.createElement("button");
        favouriteBtn.textContent = isFavourite(movie.id) ? "♥ Saved" : "♡ Save";
        favouriteBtn.addEventListener("click", () => toggleFavourite(movie));

        actions.append(detailsBtn, favouriteBtn);
        info.append(title, meta, actions);
        card.append(poster, info);
        grid.append(card);
    });
}

function showFavourites() {
    showingFavourites = true;
    searchMode = false;
    sectionTitle.textContent = "My Favourites";
    currentMovies = getFavourites();
    renderMovies(currentMovies);
}

async function showDetails(id) {
    movieDetails.textContent = "Loading details...";
    movieDialog.showModal();

    try {
        const movie = await apiRequest(`/api/movie/${id}`);
        movieDetails.replaceChildren();

        if (movie.poster_path) {
            const poster = document.createElement("img");
            poster.className = "detail-poster";
            poster.src = IMAGE_URL + movie.poster_path;
            poster.alt = `${movie.title} poster`;
            movieDetails.append(poster);
        }

        const title = document.createElement("h2");
        title.textContent = movie.title || "Untitled";

        const facts = document.createElement("p");
        facts.className = "movie-meta";
        facts.textContent =
            `${movie.release_date || "Release date unknown"} · ` +
            `★ ${Number(movie.vote_average || 0).toFixed(1)}`;

        const overview = document.createElement("p");
        overview.textContent = movie.overview || "No overview available.";

        const genres = document.createElement("p");
        genres.className = "movie-meta";
        genres.textContent = "Genres: " +
            ((movie.genres || []).map(genre => genre.name).join(", ") || "Unknown");

        movieDetails.append(title, facts, overview, genres);
    } catch (error) {
        movieDetails.textContent = error.message;
    }
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        searchMovies(query);
    } else {
        loadPopular();
    }
});

favouritesBtn.addEventListener("click", showFavourites);

document.getElementById("closeDialog").addEventListener("click", () => {
    movieDialog.close();
});

movieDialog.addEventListener("click", event => {
    if (event.target === movieDialog) {
        movieDialog.close();
    }
});

function applyTheme(theme) {
    document.body.classList.toggle("light", theme === "light");
    themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
    themeBtn.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
    );
}

const savedTheme = localStorage.getItem("cineScopeTheme") || "dark";
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light")
        ? "dark"
        : "light";

    localStorage.setItem("cineScopeTheme", nextTheme);
    applyTheme(nextTheme);
});

loadPopular();
