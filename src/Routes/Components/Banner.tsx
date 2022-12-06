import styled from "styled-components";
import { IData } from "../../api";
import { makeImagePath } from "../../utils";
import { AiFillCaretRight, AiOutlineInfoCircle } from "react-icons/ai";

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
  margin-bottom: 20px;
`;

const Overview = styled.p`
  width: 34%;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 25px;
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 1vw;
`;

interface IBannerBtn {
  width: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const BannerBtn = styled.button<IBannerBtn>`
  width: ${(props) => props.width};
  padding: 18px;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgColor};
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
`;

const BtnICon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  margin-right: 10px;
  svg {
    width: 28px;
    height: 28px;
  }
`;

const BtnText = styled.div`
  font-size: 28px;
  font-weight: 400;
`;
function Banner({ bannerInfo }: { bannerInfo: IData }) {
  return (
    <Wrapper bgphoto={makeImagePath(bannerInfo.backdrop_path || "")}>
      <Title>{bannerInfo.title ? bannerInfo.title : bannerInfo.name}</Title>
      <Overview>{bannerInfo.overview}</Overview>
      <ButtonArea>
        <BannerBtn
          width={"170px"}
          color={"#000"}
          bgColor={"rgba(255, 255, 255, 1)"}
          hoverColor={"rgba(255, 255, 255, 0.75)"}
        >
          <BtnICon>
            <AiFillCaretRight />
          </BtnICon>
          <BtnText>재생</BtnText>
        </BannerBtn>
        <BannerBtn
          width={"220px"}
          color={"#fff"}
          bgColor={"rgba(109, 109, 110, 0.7)"}
          hoverColor={"rgba(109, 109, 110, 0.4)"}
        >
          <BtnICon>
            <AiOutlineInfoCircle />
          </BtnICon>
          <BtnText>상세 정보</BtnText>
        </BannerBtn>
      </ButtonArea>
    </Wrapper>
  );
}

export default Banner;
