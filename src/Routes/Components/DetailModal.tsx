import { motion } from "framer-motion";
import { PathMatch, RouteMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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

function DetailModal(bigMatch: PathMatch, clickedDetail: any) {
  const navigate = useNavigate();
  const onOverlayClicked = () => {
    navigate("/");
  };

  return (
    <>
      <Overlay
        onClick={onOverlayClicked}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigMovie layoutId={bigMatch.params.movieId}>
        {clickedDetail && (
          <>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                  clickedDetail?.backdrop_path,
                  "w500"
                )})`,
              }}
            />
            <BigTitle>{clickedDetail?.title}</BigTitle>
            <BigOverView>{clickedDetail.overview}</BigOverView>
          </>
        )}
      </BigMovie>
    </>
  );
}

export default DetailModal;
