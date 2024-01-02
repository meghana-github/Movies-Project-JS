let data;
let movies;
let movieIds;
let filteredMovies;
let finalMovieIds;
let hindiMovies;
let filteredMoviesByGenre;
let filteredMoviesByName;
let filteredMoviesByNameIds;
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';


import('./moviesPlay.js')
    .then(res => {
        data = res;
        hindiMovies = res.hindiMovies;
        movies = hindiMovies.concat(res.movies);
        run();
    });

function run() {
    movies.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return dateA - dateB;
    });
    createDecadeDropdown();
}

function selectedRadioOption(){
    const selectedLanguage = document.querySelector('input[name="frequency"]:checked').value;
    if (selectedLanguage === "Hindi"){
     movieIds = data.hindiMovies.map(movie => movie.tmdbId); 
    }
    else if (selectedLanguage === "International"){
     movieIds = data.movies.map(movie => movie.tmdbId); 
    }
    else if (selectedLanguage === "Both"){
     const hindiMovieIds = data.hindiMovies.map(movie => movie.tmdbId);
     const englishMovieIds = data.movies.map(movie => movie.tmdbId);
     movieIds = [...englishMovieIds, ...hindiMovieIds];
    }
 }

function createDecadeDropdown() {
    const oldestDate = new Date(movies[0].releaseDate).getFullYear();
    const newestDate = new Date(movies[movies.length - 1].releaseDate).getFullYear();
    const select = document.getElementById('decadeFilter');
    const nullOption = document.createElement('option');
    nullOption.value = 0;
    nullOption.textContent = 'Select Decade';
    select.add(nullOption);
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
    filteredMovies = movies.filter(movie => {
        const movieYear = new Date(movie.releaseDate).getFullYear();
        return movieYear >= parseInt(startYear) && movieYear <= parseInt(endYear);
    });
}

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
        const filteredHindiMovies = hindiMovies.filter(movie => 
          selectedGenres.every(selectedGenre => 
               movie.genres.some(genre => genre.name === selectedGenre)
          )
      );
            filteredMoviesByGenre = filteredEnglishMovies.concat(filteredHindiMovies);
            console.log('genres Movies:',filteredMoviesByGenre);
    }  
}

function checkFilters(){
    selectedCheckBox();
    const filteredMoviesByGenresId = filteredMoviesByGenre.map(movies => movies.tmdbId);
    let filteredMovieIds = filteredMovies.map(movies => movies.tmdbId);
    filteredMovieIds = filteredMoviesByGenresId.filter(movie => filteredMovieIds.includes(movie))
    finalMovieIds = movieIds.filter(movie => filteredMovieIds.includes(movie));       
    console.log('Final Movie Ids:',finalMovieIds); 
    getMovieInformation(finalMovieIds);
}

function filterMoviesByName() {
    const filterText = document.getElementById('inputText').value.toLowerCase();
    const filteredInternationalMovies = data.movies.filter(movie =>
      movie.title.toLowerCase().startsWith(filterText) ||
      movie.cast.some(actor => actor.name.toLowerCase().startsWith(filterText))
    );
    const filteredHindiMovies = hindiMovies.filter(movie =>
      movie.title.toLowerCase().startsWith(filterText) ||
      movie.cast.some(actor => actor.name.toLowerCase().startsWith(filterText))
    );
        filteredMoviesByName = filteredInternationalMovies.concat(filteredHindiMovies);   
        document.getElementById('content').innerHTML = getMovieHtml(filteredMoviesByName);
        filteredMoviesByNameIds = filteredMoviesByName.map(movie => movie.tmdbId);
        console.log('filteredMoviesByName:',filteredMoviesByName);
        getMovieInformation(filteredMoviesByNameIds);
        
    }

function getMovieInformation(filterIds) {
    const fetchArray = filterIds.map(movieId => {
        return (fetch(`${movieUrl}${movieId}?api_key=${apiKey}`)
            .then(response => response.json()));
    });

    Promise.all(fetchArray)
        .then(fetchResponses => {
            const moviesInfo = fetchResponses.map(resp => ({
                id: resp.id, overview: resp.overview,
                posterPath: resp.poster_path, releaseDate: resp.release_date,
                runTime: resp.runtime, tagLine: resp.tagline,
                title: resp.title
            }));
            document.getElementById('content').innerHTML = getMovieHtml(moviesInfo);
            if(finalMovieIds.length === 0){
                document.getElementById('content').innerHTML = '<p>No movies found for the selected filters.</p>';
            }
        });
}

function getMovieHtml(moviesInfo) {
    let movieHtml = '<div class="ui link cards">';
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
            </div>`;
    }, '');

    movieHtml += `${movieCards}</div>`;
    return movieHtml;
}
