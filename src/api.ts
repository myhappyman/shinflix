const API_KEY = "dbf6ad83e201e98cbf498fbcfd80bf8a";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE = "ko-KO";
const REGION = "KR";

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

export interface IDetailInfo {
  id: number;
  overview: string;
  title: string;
  vote_average: number;
  runtime: number;
  backdrop_path: string;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

export function getPopularTvShows() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

export function getDetailMovies(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}
