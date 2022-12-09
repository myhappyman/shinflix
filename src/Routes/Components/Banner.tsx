import styled from "styled-components";
import { IData } from "../../api";
import { makeImagePath } from "../../utils";
import { AiFillCaretRight, AiOutlineInfoCircle } from "react-icons/ai";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./Modal";
import { useRecoilValue } from "recoil";
import { BannerSize } from "../../atoms";

const Wrapper = styled.div<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 6.8rem;
  background-repeat: no-repeat;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: 100%;
  background-position: center center;
  /* background: no-repeat url() left/right/center top/bottom/center / cover, 100%,contain; */

  @media screen and (max-width: 1500px) {
    height: 95vh;
  }
  @media screen and (max-width: 1400px) {
    height: 90vh;
  }
  @media screen and (max-width: 1300px) {
    height: 85vh;
  }
  @media screen and (max-width: 1200px) {
    height: 80vh;
  }
  @media screen and (max-width: 1100px) {
    height: 70vh;
  }
  @media screen and (max-width: 1000px) {
    height: 65vh;
    padding: 4.2rem;
  }
  @media screen and (max-width: 500px) {
    height: 50vh;
    padding: 3.4rem;
  }
  @media screen and (min-width: 216px) {
    background-position: center top;
  }
  @media screen and (min-width: 1680px) {
    background-position: center center;
  }
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 4rem;
  font-weight: 900;

  @media only screen and (max-width: 1200px) {
    font-size: 3.2rem;
  }
  @media only screen and (max-width: 700px) {
    font-size: 2.6rem;
  }
  @media only screen and (max-width: 350px) {
    margin: 0;
  }
`;

const Overview = styled.p`
  margin-bottom: 2rem;
  width: 52.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 2.5rem;

  @media only screen and (max-width: 1200px) {
    width: 40rem;
    font-size: 1.2rem;
    line-height: 2rem;
  }
  @media only screen and (max-width: 700px) {
    width: 34rem;
    font-size: 1rem;
    line-height: 1.8rem;
  }
  @media only screen and (max-width: 700px) {
    font-size: 0.8rem;
    line-height: 1.6rem;
  }
  @media only screen and (max-width: 350px) {
    opacity: 0;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 1vw;
`;

interface IBannerBtn {
  color: string;
  bgcolor: string;
  hovercolor: string;
}

const BannerBtn = styled(motion.button)<IBannerBtn>`
  padding: 1.8rem;
  border-radius: 1.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgcolor};
  transition: all 0.3s;
  &:hover {
    background-color: ${(props) => props.hovercolor};
  }

  @media only screen and (max-width: 1200px) {
    padding: 1.2rem;
    border-radius: 1.5rem;
  }
  @media only screen and (max-width: 700px) {
    padding: 0.6rem;
    border-radius: 1.2rem;
  }
`;

const PlayBtn = styled(BannerBtn)`
  width: 17rem;
  @media only screen and (max-width: 1000px) {
    width: 14rem;
  }
`;
const DetailInfoBtn = styled(BannerBtn)`
  width: 22rem;
  @media only screen and (max-width: 1000px) {
    width: 18rem;
  }
`;

const BtnICon = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  display: flex;
  align-items: center;
  margin-right: 1rem;
  svg {
    width: 2.8rem;
    height: 2.8rem;
  }
  @media only screen and (max-width: 1200px) {
    width: 2.4rem;
    height: 2.4rem;
  }
  @media only screen and (max-width: 1000px) {
    width: 2rem;
    height: 2rem;
  }
  @media only screen and (max-width: 700px) {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const BtnText = styled(motion.div)`
  font-size: 2.8rem;
  font-weight: 400;

  @media only screen and (max-width: 1200px) {
    font-size: 2.4rem;
  }
  @media only screen and (max-width: 1000px) {
    font-size: 2rem;
  }
  @media only screen and (max-width: 700px) {
    font-size: 1.6rem;
  }
`;

function Banner({
  bannerInfo,
  detailSearchUrl,
  requestUrl,
}: {
  bannerInfo: IData;
  detailSearchUrl: string;
  requestUrl: string;
}) {
  const bigMatch: PathMatch<string> | null = useMatch(`/:menuName/banner/:id`);
  const navigate = useNavigate();
  const onBoxClicked = (id: number) => {
    navigate(`/${detailSearchUrl}/${id}`);
  };
  const bannerBgSize = useRecoilValue(BannerSize);

  return (
    <Wrapper
      bgphoto={makeImagePath(bannerInfo.backdrop_path || "", bannerBgSize)}
    >
      <Title>{bannerInfo.title ? bannerInfo.title : bannerInfo.name}</Title>
      <Overview>{bannerInfo.overview}</Overview>
      <ButtonArea>
        <PlayBtn
          color={"#000"}
          bgcolor={"rgba(255, 255, 255, 1)"}
          hovercolor={"rgba(255, 255, 255, 0.75)"}
        >
          <BtnICon>
            <AiFillCaretRight />
          </BtnICon>
          <BtnText>재생</BtnText>
        </PlayBtn>
        <DetailInfoBtn
          color={"#fff"}
          bgcolor={"rgba(109, 109, 110, 0.7)"}
          hovercolor={"rgba(109, 109, 110, 0.4)"}
          onClick={() => onBoxClicked(bannerInfo.id)}
        >
          <BtnICon>
            <AiOutlineInfoCircle />
          </BtnICon>
          <BtnText>상세 정보</BtnText>
        </DetailInfoBtn>
      </ButtonArea>
      <AnimatePresence>
        {bigMatch ? (
          <Modal
            dataId={Number(bigMatch?.params.id)}
            listType={"coverMovie"}
            menuName={bigMatch?.params.menuName || ""}
            requestUrl={requestUrl}
          />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Banner;
