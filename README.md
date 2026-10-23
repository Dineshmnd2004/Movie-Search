
# CineScope - Movie Search Website

A beginner-friendly movie search website built with HTML, CSS,
JavaScript, Python Flask, and The Movie Database (TMDB) API.

## Features
- Search for movies by title
- Browse popular movies
- View movie details, ratings, release dates, and genres
- Save and remove favourite movies
- Dark and light themes
- Responsive layout for mobile and desktop
- Loading messages and API error handling

## Technologies
- HTML: website structure
- CSS: layout, styling, responsive design
- JavaScript: search, movie cards, favourites, theme and API calls
- Python Flask: backend routes and API requests
- TMDB API: movie information and posters
- localStorage: saves favourites and theme in the browser

## Setup

1. Install Python 3.
2. Open a terminal in the project folder.
3. Create a virtual environment:

   Windows:
   `py -m venv .venv`

4. Activate it in PowerShell:

   `.\.venv\Scripts\Activate.ps1`

5. Install the packages:

   `python -m pip install -r requirements.txt`

6. Copy `.env.example` to `.env` and add your TMDB API key.
7. Start the application:

   `python app.py`

8. Open `http://127.0.0.1:5000` in your browser.

## Project Structure

- `app.py` - Flask backend and TMDB requests
- `templates/index.html` - page structure
- `static/style.css` - styles and responsive layout
- `static/script.js` - frontend functionality
- `.env` - private TMDB API key (do not commit)
- `requirements.txt` - required Python packages

## API Routes

- `GET /api/popular` - popular movies
- `GET /api/search?query=avatar` - search movies
- `GET /api/movie/550` - details for a movie ID

## Notes

Movie data and posters are provided by TMDB.
This project is not endorsed or certified by TMDB.
