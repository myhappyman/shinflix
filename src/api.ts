const API_KEY = "dbf6ad83e201e98cbf498fbcfd80bf8a";
const LANGUAGE = "ko-KO";
const REGION = "KR";
const BASE_PATH = "https://api.themoviedb.org/3";
const TAIL_PATH = `api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`;
export const LIST_TYPE = [
  "nowPlayingMoviesList",
  "upcomingList",
  "popularMovieList",
  "tvShowList",
]; // 영상 종류

// 영화 데이터
export interface IData {
  id: number; // 정보의 id
  backdrop_path: string; // 대형 이미지
  poster_path: string; // 포스터 이미지
  title?: string; // 제목
  name?: string; // 제목
  overview: string; // 영화 요약
}

// themoviedb.org "movie/now_playing" api interface
export interface IGetDataResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IData[]; // 영화 데이터 interface의 []
  total_pages: number;
  total_results: number;
}

interface IGenre {
  id: number;
  name: string;
}
export interface IDetailInfo {
  id: number;
  overview: string;
  title?: string;
  name?: string;
  vote_average: number;
  runtime: number;
  backdrop_path: string;
  genres: IGenre[];
}

// Movies - NowPlaying
export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

// Movies - Popular
export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

// Movies - Upcoming
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

// TvShows
export function getPopularTvShows() {
  return fetch(`${BASE_PATH}/tv/popular?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

// Modal Popup getDetail Info Api
export function getDetailData(
  listType: string,
  menuName: string,
  movieId: number
) {
  if (menuName === "home") {
    if (listType === LIST_TYPE[3]) {
      menuName = "tv";
    } else {
      menuName = "movie";
    }
  }

  return fetch(`${BASE_PATH}/${menuName}/${movieId}?${TAIL_PATH}`).then(
    (response) => response.json()
  );
}

export interface IGetSearchResult {
  page: number;
  results: ISearch[]; // 영화 데이터 interface의 []
  total_pages: number;
  total_results: number;
}
interface ISearch {
  id: number;
  overview: string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
}
export function searchData(keyword: string) {
  return fetch(`${BASE_PATH}/search/multi?${TAIL_PATH}&query=${keyword}`)
    .then((response) => response.json())
    .catch((err) => err);
}
