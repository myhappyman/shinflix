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
  padding: 11rem 6rem 0;
  @media only screen and (max-width: 500px) {
    padding: 9rem 3rem;
  }
`;

const LeftWrap = styled.div``;

const RightWrap = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 17.4rem);
`;

const SearchForm = styled.form`
  width: 100%;
  padding-bottom: 2rem;
  color: #fff;
  z-index: 0;
`;

const Input = styled.input`
  padding: 0.5rem 0.5rem;
  color: white;
  font-size: 2.8rem;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  z-index: 1;
  transform-origin: left center;
`;
const Announcement = styled.p`
  display: inline-block;
  padding-left: 1.8rem;
  text-align: left;
  font-size: 1.4rem;
  vertical-align: bottom;
  @media only screen and (max-width: 680px) {
    display: block;
    padding: 1.8rem 0 0 0;
  }
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
          <Announcement>"{keyword}"으로 검색한 결과입니다.</Announcement>
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
