const API_KEY = "dbf6ad83e201e98cbf498fbcfd80bf8a";
const BASE_PATH = "https://api.themoviedb.org/3/";

// 영화 데이터
interface IMovie {
  id: number; // 영화 정보의 id
  backdrop_path: string; // 영화의 대형 이미지
  poster_path: string; // 영화의 포스터
  title: string; // 영화 제목
  overview: string; // 요약
}

// themoviedb.org에서 받은 영화 정보의 api interface
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[]; // 영화 데이터 interface의 []
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
