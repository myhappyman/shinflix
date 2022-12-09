import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDetailData, IDetailInfo } from "../../api";
import { makeImagePath } from "../../utils";
import ReactStars from "react-stars";
import { AiOutlineClose } from "react-icons/ai";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 99;
`;

const ModalBox = styled(motion.div)`
  position: fixed;
  top: 10rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  height: 80vh;
  overflow: hidden;
  border-radius: 1.5rem;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 100;

  @media screen and (max-height: 860px) {
    overflow: auto;
  }
  @media only screen and (max-width: 1600px) {
    width: 50vw;
  }
  @media only screen and (max-width: 1400px) {
    width: 60vw;
  }
  @media only screen and (max-width: 1200px) {
    width: 70vw;
  }
  @media only screen and (max-width: 1000px) {
    width: 80vw;
  }
  @media only screen and (max-width: 800px) {
    top: 5rem;
    width: 90vw;
    height: 90vh;
  }
  @media only screen and (max-width: 600px) {
    top: 0rem;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #4e4e4e;
    border-radius: 100px;
  }
  &::-webkit-scrollbar-track {
    background-color: #4e4e4e;
    border-radius: 100px;
    background-clip: padding-box;
    border: 3px solid transparent;
  }
`;

const ModalCover = styled.div`
  position: relative;
  width: 100%;
  height: 40rem;
  background-size: cover;
  background-position: center center;
  .closeModal {
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: #181818;
      scale: 1.3;
    }
  }

  @media only screen and (max-width: 500px) {
    .closeModal {
      width: 3rem;
      height: 3rem;
      cursor: pointer;
      &:hover {
        color: #181818;
      }
    }
  }
`;

const ModalTitle = styled.h3`
  position: relative;
  top: -10rem;
  color: ${(props) => props.theme.white.lighter};
  padding: 2rem;
  font-size: 4.6rem;
`;

const ModalCategory = styled.ul`
  position: relative;
  top: -10rem;
  padding: 2rem;
  color: ${(props) => props.theme.white.lighter};
  clear: both;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const ModalItem = styled.li`
  display: block;
  margin-bottom: 2rem;
`;

const ItemTitle = styled.span`
  float: left;
  width: 10rem;
  margin-right: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
  @media only screen and (max-width: 400px) {
    font-size: 2rem;
    line-height: 3.4rem;
  }
  @media only screen and (max-width: 300px) {
    font-size: 2.4rem;
    line-height: 4rem;
  }
  @media only screen and (max-width: 250px) {
    font-size: 2.8rem;
    line-height: 6rem;
    width: 14rem;
  }
`;

const ItemValue = styled.div`
  font-size: 1.6rem;
  line-height: 2.4rem;
  .rating {
    float: left;
    top: -0.4rem;
    margin-right: 0.5rem;
  }
  .channel {
    float: left;
    height: 2rem;
  }
  .channel ~ .channel {
    margin-left: 2rem;
  }

  @media only screen and (max-width: 400px) {
    font-size: 2rem;
    line-height: 3.4rem;
  }
  @media only screen and (max-width: 300px) {
    font-size: 2.4rem;
    line-height: 4rem;
  }
  @media only screen and (max-width: 250px) {
    font-size: 2.8rem;
    line-height: 6rem;
  }
`;

const Clear = styled.div`
  clear: both;
  margin-bottom: 2rem;
`;

const ModalOverView = styled.p`
  margin-bottom: 5rem;
  font-size: 1.4rem;
`;

interface IModal {
  dataId: number;
  listType: string;
  menuName: string;
  requestUrl: string;
  returnUrl?: string;
}

export default function Modal({
  dataId,
  listType,
  menuName,
  requestUrl,
  returnUrl,
}: IModal) {
  const navigate = useNavigate();
  const modalMatch = useMatch(`/${menuName}/${listType}/:id`);
  const onOverlayClicked = () => {
    if (menuName === "home") menuName = "";

    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate(`/${menuName}`);
    }
  };

  const { data } = useQuery<IDetailInfo>(
    [listType + dataId, "detail" + dataId],
    () => getDetailData(requestUrl, dataId) || null
  );

  const hourMinSec = (time: number) => {
    if (time > 60) {
      return `${Math.floor(time / 60)}시간 ${time % 60}분`;
    } else {
      return time + "분";
    }
  };

  return (
    <>
      <Overlay
        onClick={onOverlayClicked}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <ModalBox layoutId={modalMatch?.params.id + listType}>
        {
          <>
            <ModalCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                  data?.backdrop_path || "",
                  "w500"
                )})`,
              }}
            >
              <AiOutlineClose
                onClick={onOverlayClicked}
                className="closeModal"
                size={"2rem"}
              />
            </ModalCover>
            <ModalTitle>{data?.title ? data?.title : data?.name}</ModalTitle>
            <ModalCategory>
              {/* 줄거리 */}
              <ModalItem>
                <ModalOverView title={data?.overview}>
                  {data && data?.overview.length > 390
                    ? data?.overview.slice(0, 390) + "..."
                    : data?.overview}
                </ModalOverView>
              </ModalItem>

              {/* 영화 - 개봉일, tv - 편성일 */}
              {data?.release_date ? (
                <ModalItem>
                  <ItemTitle>개봉일 </ItemTitle>
                  <ItemValue>{data?.release_date}</ItemValue>
                </ModalItem>
              ) : (
                <ModalItem>
                  <ItemTitle>편성 </ItemTitle>
                  <ItemValue>{data?.first_air_date}</ItemValue>
                </ModalItem>
              )}

              {/* tv - 송출 방송사 및 vod사 */}
              {data?.networks && data?.networks.length > 0 ? (
                <>
                  <ModalItem>
                    <ItemTitle>채널 </ItemTitle>
                    <ItemValue>
                      {data?.networks.map((n) => (
                        <img
                          className="channel"
                          key={n.id}
                          alt={n.name}
                          src={makeImagePath(n.logo_path || "")}
                        />
                      ))}
                    </ItemValue>
                  </ModalItem>
                  <Clear />
                </>
              ) : null}

              {/* 평점 */}
              <ModalItem>
                <ItemTitle>평점 </ItemTitle>
                <ItemValue>
                  <ReactStars
                    count={5}
                    value={data?.vote_average ? data?.vote_average / 2 : 0}
                    color1="#E6E6E6"
                    color2="#FFCC33"
                    half
                    size={20}
                    edit={false}
                    className="rating"
                  />
                  <span>({data?.vote_average.toFixed(1)})</span>
                </ItemValue>
              </ModalItem>

              {/* 장르 */}
              {data?.genres && data?.genres.length > 0 ? (
                <ModalItem>
                  <ItemTitle>장르</ItemTitle>
                  <ItemValue>
                    {data?.genres.map((g, idx) =>
                      data?.genres.length === idx + 1 ? (
                        <span key={g.id}>{g.name}</span>
                      ) : (
                        <span key={g.id}>{g.name}, </span>
                      )
                    )}
                  </ItemValue>
                </ModalItem>
              ) : null}

              {/* 영화 - 상영시간 */}
              {data?.runtime ? (
                <ModalItem>
                  <ItemTitle>상영시간</ItemTitle>
                  <ItemValue>{hourMinSec(data?.runtime)}</ItemValue>
                </ModalItem>
              ) : null}
            </ModalCategory>
          </>
        }
      </ModalBox>
    </>
  );
}