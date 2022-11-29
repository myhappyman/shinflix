import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, getPopularTvShows, IData, IGetDataResult } from "../api";
import Banner from "./Components/Banner";
import Sliders from "./Components/Slider";

const LIST_TYPE = ["moviesList", "tvShowList"]; // 영상 종류

const Wrapper = styled.div`
  background: #000;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderArea = styled.div`
  position: relative;
  top: -130px;
`;

function Home() {
  // get Movies
  const { data: moviesList, isLoading: movieLoading } =
    useQuery<IGetDataResult>([LIST_TYPE[0], "nowPlaying"], getMovies);

  // get Tv Show
  const { data: tvShowList, isLoading: tvShowLoading } =
    useQuery<IGetDataResult>(
      [LIST_TYPE[1], "popularTvShows"],
      getPopularTvShows
    );

  return (
    <Wrapper>
      {movieLoading || tvShowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bannerInfo={moviesList?.results[0] as IData} />
          <SliderArea>
            <Sliders
              data={moviesList as IGetDataResult}
              title={"NOW PLAYING"}
              listType={LIST_TYPE[0]}
            />
            <Sliders
              data={tvShowList as IGetDataResult}
              title={"POPULAR TV SHOWS"}
              listType={LIST_TYPE[1]}
            />
          </SliderArea>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
