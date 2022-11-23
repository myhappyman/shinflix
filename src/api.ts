const API_KEY = "dbf6ad83e201e98cbf498fbcfd80bf8a";
const BASE_PATH = "https://api.themoviedb.org/3/"

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}