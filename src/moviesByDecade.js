let movies = [];  // Initialize movies array
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';
// Fetching data from external file
import('./moviesPlay.js')
    .then(res => {
        console.log('Data imported into data constant');
        movies = res.movies; 
        run();       
    })

function run() {
    movies.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return dateA - dateB;
    });
   createDecadeDropdown();
}

function createDecadeDropdown() {
    const oldestDate = new Date(movies[0].releaseDate).getFullYear();
    const newestDate = new Date(movies[movies.length - 1].releaseDate).getFullYear();
    const select = document.getElementById('decadeFilter');

    for (let year = oldestDate; year <= newestDate; year += 10) {
        const option = document.createElement('option');
        option.value = `${year}-${year + 9}`;
        option.textContent = `${year}-${year + 9}`;
        select.add(option);
    }
    select.addEventListener('change', filterByDecade);
}

function filterByDecade() {
    const selectedDecade = document.getElementById('decadeFilter').value;
    const [startYear, endYear] = selectedDecade.split('-');
    const filteredMovies = movies.filter(movie => {
        const movieYear = new Date(movie.releaseDate).getFullYear();
        return movieYear >= parseInt(startYear) && movieYear <= parseInt(endYear);
    });
    if (filteredMovies.length === 0) {
        document.getElementById('content').innerHTML = '<p>No movies found for the selected decade.</p>';
    } else {
        getMovieInformation(filteredMovies);
    }
}

function getMovieInformation(filteredMovies) {
    const movieIds = filteredMovies.map(movie => movie.tmdbId);
    const fetchArray = movieIds.map(movieId => {
      return (
        fetch(`${movieUrl}${movieId}?api_key=${apiKey}`)
          .then(response => response.json())
      )
    });
    Promise.all(fetchArray)
      .then(fetchResponses => {
        const moviesInfo = fetchResponses.map(resp => {
          return {
            id: resp.id, overview: resp.overview,
            posterPath: resp.poster_path, releaseDate: resp.release_date,
            runTime: resp.runtime, tagLine: resp.tagline,
            title: resp.title
          }
        })
        document.getElementById('content').innerHTML = getMovieHtml(moviesInfo);
      })
  }
 
  function getMovieHtml(moviesInfo) {
    let movieHtml = '<div class="ui link cards">'
    const movieCards = moviesInfo.reduce((html, movie) => {
      return html + `
        <div class="card">
          <div class="image">
            <href='./movie.html?id=${movie.id}&posterPath=${movie.posterPath}'>
            <img src='${imageUrl}${movie.posterPath}' />
          </div>
          <div class="content">
            <div class="header">${movie.title}</div>
            <div class="meta">
              ${movie.releaseDate}
            </div>
            <div class="description">
              ${movie.tagLine}
            </div>
          </div>
        </div>
      `
    }, '');
 
    movieHtml+= `${movieCards}</div>`;
    return movieHtml;
  }