import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import path from "path";

const OFFSET = 6; // 한번에 보여줄 영화 개수

const Wrapper = styled.div`
  background: #000;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
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
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const SliderTitle = styled.div`
  position: absolute;
  top: -50px;
  font-size: 24px;
  padding-left: 20px;
  font-weight: 700;
`;

const ArrowBtn = styled.div`
  width: 30px;
  height: 200px;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 1;
`;

const LeftArrowBtn = styled(ArrowBtn)`
  left: 0;
`;

const RightArrowBtn = styled(ArrowBtn)`
  right: 0;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: #fff;
  height: 200px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  font-size: 40px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: relative;
  top: 158px;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

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

const arrowVariants = {
  normal: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
};

const rowVariants = {
  hidden: (back: number) => {
    return {
      x: window.innerWidth * back + 5 * back,
    };
  },
  visible: {
    x: 0,
  },
  exit: (back: number) => {
    console.log("exit", back);
    const xValue = window.innerWidth * -1 * back - 5 * back;
    console.log("exit", xValue);
    return {
      x: xValue,
    };
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [isBack, setIsBack] = useState(1); // left: -1, right: 1
  const [index, setIndex] = useState(0);
  const changeIndex = (slideDirect: boolean) => {
    if (data) {
      if (leaving) return;
      toggleLeaving(); // true 처리용 > 강제 흘러감 방지
      const totalMovies = data.results.length - 1; // 메인 배너를 사용했기때문에 1개를 뺀다.
      //20개 리스트에서 18개만 보여주기 위해 floor처리
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1; // 0에서 시작하므로 1개를 뺸다.

      if (isBack === 1) setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      else setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const leftSlider = () => {
    setIsBack(-1);
    console.log("leftSlider", isBack);
    changeIndex(false);
  };
  const rightSlider = () => {
    setIsBack(1);
    console.log("rightSlider", isBack);
    changeIndex(true);
  };

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClicked = () => {
    navigate("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>NOW PLAYING</SliderTitle>
            <LeftArrowBtn onClick={leftSlider}>
              <span>&#60;</span>
            </LeftArrowBtn>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={isBack}
            >
              <Row
                custom={isBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1) // slice1을 하고 시작하는 이유는 첫번째 배경으로 사용한 영화는 제외하기 위함이다.
                  .slice(OFFSET * index, OFFSET * index + OFFSET)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={movie.id + ""}
                      bgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RightArrowBtn onClick={rightSlider}>
              <span>&#62;</span>
            </RightArrowBtn>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverView>{clickedMovie.overview}</BigOverView>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
