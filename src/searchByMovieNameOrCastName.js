let data;
let movieIds;
let hindiMoviesData;
    const apiKey = '42ee719896b25f8821890615eeabf17f';
    const movieUrl = 'https://api.themoviedb.org/3/movie/';
    const imageUrl = 'https://image.tmdb.org/t/p/original';
 
    import('./moviesPlay.js')
      .then(res => {
        data = res.movies;
        hindiMoviesData = res.hindiMovies; 
        });
 
      function filterMovies() {
        const filterText = document.getElementById('inputText').value.toLowerCase();
        const filteredInternationalMovies = data.filter(movie =>
          movie.title.toLowerCase().startsWith(filterText) ||
          movie.cast.some(actor => actor.name.toLowerCase().startsWith(filterText))
        );
        const filteredHindiMovies = hindiMoviesData.filter(movie =>
          movie.title.toLowerCase().startsWith(filterText) ||
          movie.cast.some(actor => actor.name.toLowerCase().startsWith(filterText))
        );
        const filteredMovies = filteredInternationalMovies.concat(filteredHindiMovies);
        document.getElementById('content').innerHTML = getMovieHtml(filteredMovies);
        getMovieInformation(filteredMovies);
      }
     
      function getMovieInformation(filteredMovies) {
        movieIds = filteredMovies.map(movie => movie.tmdbId);
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
                id: resp.id,
                overview: resp.overview,
                posterPath: resp.poster_path,
                releaseDate: resp.release_date,
                runTime: resp.runtime,
                tagLine: resp.tagline,
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
                <img src='${imageUrl}${movie.posterPath}'/>
              </div>
              <div class="content">
                <div class="header">${movie.title}</div>
                <div class="meta">
                  <a>${movie.releaseDate}</a>
                </div>
                <div class="description">
                  ${movie.tagLine}
                </div>
               
              </div>
            </div>
          `
        }, '');
     
        movieHtml += `${movieCards}</div>`;
        return movieHtml;
      }