import styled from "styled-components";
import { IData } from "../../api";
import { makeImagePath } from "../../utils";

const Wrapper = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 900;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  width: 34%;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 25px;
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 1vw;
`;

const BannerBtn = styled.button`
  width: 180px;
  padding: 15px;
  font-size: 28px;
  font-weight: 400;
  border-radius: 15px;
  cursor: pointer;
`;

function Banner({ bannerInfo }: { bannerInfo: IData }) {
  return (
    <Wrapper bgphoto={makeImagePath(bannerInfo.backdrop_path || "")}>
      <Title>{bannerInfo.title ? bannerInfo.title : bannerInfo.name}</Title>
      <Overview>{bannerInfo.overview}</Overview>
      <ButtonArea>
        <BannerBtn>재생</BannerBtn>
        <BannerBtn>상세 정보</BannerBtn>
      </ButtonArea>
    </Wrapper>
  );
}

export default Banner;
