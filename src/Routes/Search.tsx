import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { searchData, IGetSearchResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  margin-top: 30px;
  top: 80px;
`;

const LeftWrap = styled.div`
  float: left;
  width: 400px;
  height: 100vh;
`;

const RightWrap = styled.div`
  float: left;
  width: calc(100% - 400px);
  height: 100vh;
  position: relative;
`;

const SearchForm = styled.form`
  color: white;
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
  z-index: 0;
`;

const Input = styled.input`
  transform-origin: left center;
  padding: 5px 5px;
  z-index: -1;
  color: white;
  font-size: 28px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  margin-bottom: 20px;
  z-index: 1;
`;
const Announcement = styled.p`
  text-align: left;
`;

const Row = styled.div`
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

interface ISearchForm {
  searchKeyword: string;
}

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const navigate = useNavigate();
  const { data } = useQuery<IGetSearchResult>(
    ["search" + keyword, "search" + keyword],
    () => searchData(keyword || "")
  );
  const { register, handleSubmit, setValue } = useForm<ISearchForm>();
  
  setValue("searchKeyword", keyword || "");
  const onValid = (data: ISearchForm) => {
    navigate(`/search?keyword=${data.searchKeyword}`);
  };
  return (
    <Wrapper>
      <LeftWrap>
        <SearchForm onSubmit={handleSubmit(onValid)}>
          <Input type="text" {...register("searchKeyword")} />
          <Announcement>"{keyword}"로 검색한 결과입니다.</Announcement>
        </SearchForm>
      </LeftWrap>
      <RightWrap>
        {keyword && data && data.results.length > 0 ? (
          <Row>
            {data?.results.map((d) => (
              <Box
                key={d.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(d.backdrop_path || "", "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{d.title ? d.title : d.name}</h4>
                </Info>
              </Box>
            ))}
          </Row>
        ) : (
          <h1>'{keyword}' 검색 결과가 없습니다.</h1>
        )}
      </RightWrap>
    </Wrapper>
  );
}

export default Search;
