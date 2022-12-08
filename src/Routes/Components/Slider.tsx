import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import styled from "styled-components";
import { IGetDataResult } from "../../api";
import { makeImagePath } from "../../utils";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useRecoilState, useRecoilValue } from "recoil";
import { windowWidth } from "../../atoms";

const Wrapper = styled.div`
  position: relative;
  height: 23.9rem;
  margin-top: 3rem;
  :hover .arrow {
    opacity: 1;
  }
`;

const Title = styled.div`
  font-size: 2.4rem;
  padding-left: 2rem;
  font-weight: 700;
  padding-bottom: 1rem;
`;

const ArrowBtn = styled(motion.div)`
  position: absolute;
  top: 58%;
  transform: translateY(-50%);
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 90;
  opacity: 0;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    color: #000;
    background-color: #fff;
  }
  svg {
    width: 2.8rem;
    height: 2.8rem;
  }
`;

const LeftArrowBtn = styled(ArrowBtn)`
  left: 0;
`;

const RightArrowBtn = styled(ArrowBtn)`
  right: 0;
`;

const Row = styled(motion.div)<{ gridcnt: number }>`
  position: absolute;
  left: 0;
  /* display: grid;
  gap: 5px;
  grid-template-columns: repeat(${(props) => props.gridcnt}, 1fr); */
  margin-bottom: 3rem;
  width: 100%;
  clear: both;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const Box = styled(motion.div)<{ bgphoto: string; offset: number }>`
  background-color: #fff;
  display: block;
  float: left;
  width: calc(100% / ${(props) => props.offset} - 5px);
  height: 16rem;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  font-size: 4rem;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  & ~ & {
    margin-left: 0.6rem;
  }

  @media only screen and (max-width: 800px) {
    height: 13rem;
  }
  @media only screen and (max-width: 280px) {
    height: 18rem;
  }
`;

const Info = styled(motion.div)`
  padding: 1rem;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: relative;
  top: 15.8rem;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 1.8rem;
  }
`;

const rowVariants = {
  hidden: (right: number) => {
    return {
      x: right === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (right: number) => {
    return {
      x: right === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
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
  const width = useRecoilValue(windowWidth);
  const getOffset = () => {
    if (width > 1400) {
      setOffset(6);
    } else if (width > 1130) {
      setOffset(5);
    } else if (width > 900) {
      setOffset(4);
    } else if (width > 680) {
      setOffset(3);
    } else if (width > 250) {
      setOffset(2);
    } else {
      setOffset(1);
    }
  };
  const [offset, setOffset] = useState(6); // Slide 보여줄 개수
  useEffect(() => getOffset, [width]);
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
      const maxIndex = Math.floor(totalLength / offset);
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
        <AiOutlineLeft />
      </LeftArrowBtn>
      <RightArrowBtn className="arrow" onClick={() => changeIndex(1)}>
        <AiOutlineRight />
      </RightArrowBtn>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={isRight}
      >
        <Row
          gridcnt={offset}
          custom={isRight}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(offset * index, offset * index + offset)
            .map((d) => (
              <Box
                key={d.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                layoutId={d.id + "" + listType}
                bgphoto={makeImagePath(d.backdrop_path || "", "w500")}
                offset={offset}
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
