import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDetailData, IDetailInfo } from "../../api";
import { makeImagePath } from "../../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 99;
`;

const BigMovie = styled(motion.div)`
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
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

interface IModal {
  listType: string;
  menuName: string;
}

export default function Modal({ listType, menuName }: IModal) {
  const navigate = useNavigate();
  const bigMatch = useMatch(`/${menuName}/${listType}/:id`);
  const onOverlayClicked = () => {
    console.log("onOverlayClicked", menuName);
    if (menuName === "home") menuName = "";
    navigate(`/${menuName}`);
  };

  const { data, isLoading } = useQuery<IDetailInfo>(
    [listType + bigMatch?.params.id, "detail" + bigMatch?.params.id],
    () => getDetailData(listType, menuName, +bigMatch?.params.id!) || null
  );

  return (
    <AnimatePresence>
      {bigMatch && data && !isLoading ? (
        <>
          <Overlay
            onClick={onOverlayClicked}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <BigMovie layoutId={bigMatch.params.id + listType}>
            {
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                      data?.backdrop_path || "",
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>{data?.title ? data?.title : data?.name}</BigTitle>
                <BigOverView>{data?.overview}</BigOverView>
              </>
            }
          </BigMovie>
        </>
      ) : null}
    </AnimatePresence>
  );
}
