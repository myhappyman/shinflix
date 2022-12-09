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
  margin-top: 3rem;
  top: 8rem;
  display: flex;
  @media screen and (max-width: 1760px) {
    flex-direction: column;
  }
`;

const LeftWrap = styled.div`
  width: 40rem;
  height: 100vh;
  @media screen and (max-width: 1760px) {
    width: 100vw;
    height: auto;
    margin-bottom: 5rem;
  }
`;

const RightWrap = styled.div`
  width: calc(100% - 40rem);
  height: 100vh;
  position: relative;
  @media screen and (max-width: 1760px) {
    width: 100vw;
    height: 100vh;
  }
`;

const SearchForm = styled.form`
  color: white;
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  width: 100%;
  padding: 0 1.5rem;
  z-index: 0;
`;

const Input = styled.input`
  transform-origin: left center;
  padding: 0.5rem 0.5rem;
  z-index: -1;
  color: white;
  font-size: 2.8rem;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  margin-bottom: 2rem;
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
