import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDetailData, IDetailInfo } from "../../api";
import { makeImagePath } from "../../utils";
import ReactStars from "react-stars";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 99;
`;

const ModalBox = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 100;

  @media only screen and (max-width: 500px) {
    width: 90vw;
  }
`;

const ModalCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const ModalTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -100px;
`;

const ModalCategory = styled.ul`
  position: relative;
  top: -100px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const ModalItem = styled.li`
  margin-bottom: 20px;
`;

const ItemTitle = styled.span`
  width: 100px;
  font-size: 18px;
  font-weight: 700;
  margin-right: 10px;
  float: left;
`;

const ItemValue = styled.div`
  font-size: 16px;
  .rating {
    top: -4px;
    float: left;
    margin-right: 5px;
  }
  .channel {
    float: left;
    height: 20px;
  }
  .channel ~ .channel {
    margin-left: 20px;
  }
`;

const Clear = styled.div`
  clear: both;
  margin-bottom: 20px;
`;

const ModalOverView = styled.p`
  margin-bottom: 50px;
  font-size: 14px;
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
            />
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
