import styled from "styled-components";
import { IData } from "../../api";
import { makeImagePath } from "../../utils";
import { AiFillCaretRight, AiOutlineInfoCircle } from "react-icons/ai";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./Modal";

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
  bgcolor: string;
  hovercolor: string;
}

const BannerBtn = styled(motion.button)<IBannerBtn>`
  width: ${(props) => props.width};
  padding: 18px;
  border-radius: 15px;
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

const BtnText = styled(motion.div)`
  font-size: 28px;
  font-weight: 400;
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
  console.log("requestUrlrequestUrlrequestUrl", requestUrl);
  const bigMatch: PathMatch<string> | null = useMatch(`/:menuName/banner/:id`);
  const navigate = useNavigate();
  const onBoxClicked = (id: number) => {
    navigate(`/${detailSearchUrl}/${id}`);
  };

  return (
    <Wrapper bgphoto={makeImagePath(bannerInfo.backdrop_path || "")}>
      <Title>{bannerInfo.title ? bannerInfo.title : bannerInfo.name}</Title>
      <Overview>{bannerInfo.overview}</Overview>
      <ButtonArea>
        <BannerBtn
          width={"170px"}
          color={"#000"}
          bgcolor={"rgba(255, 255, 255, 1)"}
          hovercolor={"rgba(255, 255, 255, 0.75)"}
        >
          <BtnICon>
            <AiFillCaretRight />
          </BtnICon>
          <BtnText>재생</BtnText>
        </BannerBtn>
        <BannerBtn
          width={"220px"}
          color={"#fff"}
          bgcolor={"rgba(109, 109, 110, 0.7)"}
          hovercolor={"rgba(109, 109, 110, 0.4)"}
          onClick={() => onBoxClicked(bannerInfo.id)}
        >
          <BtnICon>
            <AiOutlineInfoCircle />
          </BtnICon>
          <BtnText>상세 정보</BtnText>
        </BannerBtn>
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
