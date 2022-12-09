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
  top: 8rem;
  display: flex;
  height: 100vh;
  margin-top: 3rem;
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
  position: relative;
  width: calc(100% - 40rem);
  height: 100vh;
  @media screen and (max-width: 1760px) {
    width: 100vw;
    height: 100vh;
  }
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  width: 100%;
  padding: 0 1.5rem;
  color: #fff;
  z-index: 0;
`;

const Input = styled.input`
  margin-bottom: 2rem;
  padding: 0.5rem 0.5rem;
  color: white;
  font-size: 2.8rem;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  z-index: 1;
  transform-origin: left center;
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
