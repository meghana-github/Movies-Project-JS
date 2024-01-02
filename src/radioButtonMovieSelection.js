let data;
let movieIds;
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';
 
import('./moviesPlay.js')
    .then(res => {
        console.log('data imported into data constant');
        data = res;
    });
 
function selectedRadioOption(){
   const selectedLanguage = document.querySelector('input[name="frequency"]:checked').value;
   if (selectedLanguage === "Hindi"){
    movieIds = data.hindiMovies.map(movie => movie.tmdbId); // Fix property access
        getMovieInformation();
   }
   else if (selectedLanguage === "International"){
    movieIds = data.movies.map(movie => movie.tmdbId); // Fix property access
        getMovieInformation();
   }
   else if (selectedLanguage === "Both"){
    const hindiMovieIds = data.hindiMovies.map(movie => movie.tmdbId);
    const englishMovieIds = data.movies.map(movie => movie.tmdbId);
    movieIds = [...englishMovieIds, ...hindiMovieIds];
        getMovieInformation();
   }
}
 
function getMovieInformation() {
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
        console.log(moviesInfo);
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
    console.log(movieHtml);
    return movieHtml;
  }