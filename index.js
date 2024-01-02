let data;
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';

  import('./src/moviesPlay.js')
    .then(res => {
      console.log('data imported into data constant');
      data = res;
      console.log(data.movies);
      populateDropdown();
    });

function populateDropdown() {
  const selectElement = document.getElementById('movies');
  data.movies.forEach(movie => {
    const option = document.createElement('option');
    option.value = movie.tmdbId;
    option.text = movie.title;
    selectElement.add(option);
  });
}

function showMovie(id, posterPath) {
	console.log('Id :', id);
	console.log('Poster Path 27 :', posterPath);
  const movieInfo = data.movies.find(movie => {
    return movie.tmdbId == id;
	
  })
  
  document.getElementById('title').innerHTML = movieInfo.title;
  document.getElementById('overview').innerHTML = movieInfo.overview;
  document.getElementById('moviePoster').innerHTML = `<img src='${imageUrl}${posterPath}' />`
 
}

function movieSelected() {
  const selectElement = document.getElementById('movies');
  const selectedMovieId = selectElement.value;
  const selectedMovie = data.movies.find(movie => movie.tmdbId == selectedMovieId);
console.log('tmbdId:', selectedMovie.tmdbId);
console.log('poster Path 44:', selectedMovie.poster_path);
getMovieInformation(selectedMovieId);	
  }

  function getMovieInformation(selectedMovieId) {
	fetch(`${movieUrl}${selectedMovieId}?api_key=${apiKey}`)
	  .then(response => response.json())
	  .then(resp => {
		const moviesInfo = {
		  id: resp.id,
		  overview: resp.overview,
		  posterPath: resp.poster_path,
		  releaseDate: resp.release_date,
		  runTime: resp.runtime,
		  tagLine: resp.tagline,
		  title: resp.title
		};
		console.log(moviesInfo);
		showMovie(moviesInfo.id, moviesInfo.posterPath);
	  });
  }
   
  

