import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getPopularTvShows, IData, IGetDataResult } from "../api";
import Banner from "./Components/Banner";
import Sliders from "./Components/Slider";

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

function Tv() {
  const { data: tvShowList, isLoading: tvShowLoading } =
    useQuery<IGetDataResult>(
      ["tvShowList", "popularTvShows"],
      getPopularTvShows
    );

  console.log(tvShowList?.results[0]);
  return (
    <Wrapper>
      {tvShowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bannerInfo={tvShowList?.results[0] as IData} />
          <SliderArea>
            <Sliders
              data={tvShowList as IGetDataResult}
              title={"POPULAR TV SHOWS"}
              listType={"tvShowList"}
              menuName={"tv"}
            />
          </SliderArea>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
