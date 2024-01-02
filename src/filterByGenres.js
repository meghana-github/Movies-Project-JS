let data;
let selectedGenres = [];
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';
// Fetching data from external file
import('./moviesPlay.js')
    .then(res => {
        console.log('Data imported into data constant');
        data = res; 
        console.log('movies:',data);    
    });

function selectedCheckBox(){
    selectedGenres = Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(checkbox => checkbox.value);
    if (selectedGenres.length === 0) {
        document.getElementById('content').innerHTML = '';
        return; 
    }
    else{
        const filteredEnglishMovies = data.movies.filter(movie => 
            selectedGenres.every(selectedGenre => 
                movie.genres.some(genre => genre.name === selectedGenre)
            )
        );
        const filteredHindiMovies = data.hindiMovies.filter(movie => 
          selectedGenres.every(selectedGenre => 
              movie.genres.some(genre => genre.name === selectedGenre)
          )
      );
      const filteredMovies = filteredEnglishMovies.concat(filteredHindiMovies);
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