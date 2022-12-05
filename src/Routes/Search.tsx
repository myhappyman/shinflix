import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  PathMatch,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import Modal from "./Components/Modal";
import SearchContent from "./SearchContent";

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

interface ISearchForm {
  searchKeyword: string;
}

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { register, handleSubmit, setValue } = useForm<ISearchForm>();
  setValue("searchKeyword", keyword || "");

  const navigate = useNavigate();
  const onValid = (data: ISearchForm) => {
    navigate(`/search?keyword=${data.searchKeyword}`);
  };

  const bigMatch: PathMatch<string> | null = useMatch(`search/:menuName/:id`);

  return (
    <Wrapper>
      <LeftWrap>
        <SearchForm onSubmit={handleSubmit(onValid)}>
          <Input type="text" {...register("searchKeyword")} />
          <Announcement>"{keyword}"로 검색한 결과입니다.</Announcement>
        </SearchForm>
      </LeftWrap>
      <RightWrap>{keyword && <SearchContent keyword={keyword} />}</RightWrap>
      <AnimatePresence>
        {bigMatch ? (
          <Modal
            dataId={Number(bigMatch?.params.id)}
            listType={bigMatch?.params.menuName || ""}
            menuName={"search"}
            requestUrl={bigMatch?.params.menuName || ""}
            returnUrl={`/search?keyword=${keyword}`}
          />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Search;
