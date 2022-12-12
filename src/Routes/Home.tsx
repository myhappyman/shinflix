import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getPopularTvShows,
  getUpcomingMovies,
  IData,
  IGetDataResult,
  LIST_TYPE,
} from "../api";
import Banner from "./Components/Banner";
import Sliders from "./Components/Slider";

const Wrapper = styled.div`
  background: #000;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const SliderArea = styled.div`
  position: relative;
  top: -16.8rem;
  @media screen and (max-width: 700px) {
    top: -8.8rem;
  }
`;

function Home() {
  // nowplaying
  const { data: nowPlayingMoviesList, isLoading } = useQuery<IGetDataResult>(
    [LIST_TYPE[0], "nowPlayingMovies"],
    getNowPlayingMovies
  );

  // upcoming
  const { data: upcomingMoviesList } = useQuery<IGetDataResult>(
    [LIST_TYPE[1], "upcomingMovies"],
    getUpcomingMovies
  );

  // popular
  const { data: popularMoviesList } = useQuery<IGetDataResult>(
    [LIST_TYPE[2], "popularMovies"],
    getPopularMovies
  );

  // get Tv Show
  const { data: tvShowList } = useQuery<IGetDataResult>(
    [LIST_TYPE[3], "popularTvShows"],
    getPopularTvShows
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bannerInfo={nowPlayingMoviesList?.results[0] as IData}
            detailSearchUrl={`home/banner`}
            requestUrl={"movie"}
          />
          <SliderArea>
            <Sliders
              data={nowPlayingMoviesList as IGetDataResult}
              title={"NOW PLAYING"}
              listType={LIST_TYPE[0]}
              mediaType={"movie"}
              menuName={"home"}
            />
            <Sliders
              data={upcomingMoviesList as IGetDataResult}
              title={"UPCOMING MOVIES"}
              listType={LIST_TYPE[1]}
              mediaType={"movie"}
              menuName={"home"}
            />
            <Sliders
              data={popularMoviesList as IGetDataResult}
              title={"POPULAR MOVIES"}
              listType={LIST_TYPE[2]}
              mediaType={"movie"}
              menuName={"home"}
            />
            <Sliders
              data={tvShowList as IGetDataResult}
              title={"POPULAR TV SHOWS"}
              listType={LIST_TYPE[3]}
              mediaType={"tv"}
              menuName={"home"}
            />
          </SliderArea>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
