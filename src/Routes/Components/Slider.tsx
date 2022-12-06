import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { IGetDataResult } from "../../api";
import { makeImagePath } from "../../utils";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Modal from "./Modal";

const Wrapper = styled.div`
  position: relative;
  height: 239px;
  margin-top: 30px;
  :hover .arrow {
    opacity: 1;
  }
`;

const Title = styled.div`
  font-size: 24px;
  padding-left: 20px;
  font-weight: 700;
  padding-bottom: 10px;
`;

const ArrowBtn = styled(motion.div)`
  position: absolute;
  top: 58%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 90;
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    color: #000;
    background-color: #fff;
  }
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
  margin-bottom: 30px;
  width: 100%;
  position: absolute;
  left: 0;
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

const rowVariants = {
  hidden: (right: number) => {
    return {
      x: right === 1 ? window.innerWidth : -window.innerWidth,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (right: number) => {
    return {
      x: right === 1 ? -window.innerWidth : window.innerWidth,
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

interface ISlider {
  data: IGetDataResult;
  title: string;
  listType: string;
  menuName: string;
  mediaType: string;
}

export default function Sliders({
  data,
  title,
  listType,
  menuName,
  mediaType,
}: ISlider) {
  const OFFSET = 6; // 한번에 보여줄 영화 개수
  const [isRight, setIsRight] = useState(1); // left: -1, right: 1
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const changeIndex = (right: number) => {
    if (leaving) return;

    if (data) {
      toggleLeaving(); // true 처리용 > 강제 흘러감 방지
      setIsRight(right);
      const totalLength = data.results.length;
      //20개 리스트에서 18개만 보여주기 위해 floor처리
      const maxIndex = Math.floor(totalLength / OFFSET);
      right === 1
        ? setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
        : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const navigate = useNavigate();
  const onBoxClicked = (menu: string, type: string, id: number) => {
    navigate(`/${menu}/${type}/${id}`);
  };

  const bigMatch: PathMatch<string> | null = useMatch(
    `/${menuName}/${listType}/:id`
  );

  return (
    <Wrapper>
      <Title>{title}</Title>
      <LeftArrowBtn className="arrow" onClick={() => changeIndex(-1)}>
        <span>&#60;</span>
      </LeftArrowBtn>
      <RightArrowBtn className="arrow" onClick={() => changeIndex(1)}>
        <span>&#62;</span>
      </RightArrowBtn>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={isRight}
      >
        <Row
          custom={isRight}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(OFFSET * index, OFFSET * index + OFFSET)
            .map((d) => (
              <Box
                key={d.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                layoutId={d.id + "" + listType}
                bgphoto={makeImagePath(d.backdrop_path || "", "w500")}
                onClick={() => {
                  onBoxClicked(menuName, listType, d.id);
                }}
              >
                <Info variants={infoVariants}>
                  <h4>{d.title ? d.title : d.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <AnimatePresence>
        {bigMatch ? (
          <Modal
            dataId={Number(bigMatch?.params.id)}
            listType={listType}
            menuName={menuName}
            requestUrl={mediaType}
          />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}
