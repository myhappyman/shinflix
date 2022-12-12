import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getPopularTvShows, IData, IGetDataResult } from "../api";
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
  margin-top: -16.8rem;
  @media screen and (max-width: 700px) {
    margin-top: -8.8rem;
  }
`;

function Tv() {
  const { data: tvShowList, isLoading: tvShowLoading } =
    useQuery<IGetDataResult>(
      ["tvShowList", "popularTvShows"],
      getPopularTvShows
    );

  return (
    <Wrapper>
      {tvShowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bannerInfo={tvShowList?.results[0] as IData}
            detailSearchUrl={`tv/banner`}
            requestUrl={"tv"}
          />
          <SliderArea>
            <Sliders
              data={tvShowList as IGetDataResult}
              title={"POPULAR TV SHOWS"}
              listType={"tvShowList"}
              menuName={"tv"}
              mediaType={"tv"}
            />
          </SliderArea>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
