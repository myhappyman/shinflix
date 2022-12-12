import { useRef } from "react";
import { Link, useMatch, PathMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 10%,
    transparent
  );
  padding: 2rem 6rem;
  font-size: 1.4rem;
  color: #fff;
  z-index: 98;

  @media only screen and (max-width: 500px) {
    padding: 2rem 3rem;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 5rem;
  width: 9.5rem;
  height: 2.5rem;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 0.6rem;
    stroke: white;
  }

  @media only screen and (max-width: 500px) {
    margin-right: 2rem;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: 2rem;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  right: -0.8rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.red};
  transition: transformX(-50%);
`;

const Search = styled.form`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  svg {
    height: 2.5rem;
  }
`;

const SearchIcon = styled(motion.svg)`
  position: absolute;
  left: 0;
  cursor: pointer;
`;

const Input = styled(motion.input)`
  position: absolute;
  right: 0px;
  padding: 0.5rem 1rem;
  padding-left: 4rem;
  border: 1px solid ${(props) => props.theme.white.lighter};
  font-size: 1.6rem;
  color: white;
  background-color: transparent;
  z-index: -1;
  transform-origin: right center;
  outline: none;

  &::placeholder {
    color: #95a5a6;
  }

  @media only screen and (max-width: 650px) {
    width: 15rem;
  }
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: { backgroundColor: "rgba(0, 0, 0, 0)" },
  scroll: { backgroundColor: "rgba(0, 0, 0, 1)" },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLocate, setSearchLocate] = useState(0);
  const homeMatch: PathMatch<string> | null = useMatch("/");
  const homeMatch2: PathMatch<string> | null = useMatch("/home/*");
  const tvMatch: PathMatch<string> | null = useMatch("/tv/*");
  const navAnimation = useAnimation();
  const inputAnimation = useAnimation();
  const { scrollY } = useScroll();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: {
      keyword: "",
    },
  });
  const initializationInput = () => {
    setSearchOpen(false);
    inputAnimation.start({
      scaleX: 0,
    });
  };
  const { ref, ...rest } = register("keyword", {
    required: true,
    minLength: 2,
    onBlur: initializationInput,
  });
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [navAnimation, scrollY]);

  const toggleSearch = () => {
    if (searchOpen) {
      //trigger the close animation
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      //trigger the open animation
      inputAnimation.start({
        scaleX: 1,
      });
    }

    setSearchOpen((prev) => !prev);
    setSearchLocate((inputRef.current?.clientWidth || -25) - 6);
  };

  return (
    <Nav variants={navVariants} animate={navAnimation} initial="top">
      <Col>
        <Link to="/">
          <Logo
            variants={logoVariants}
            whileHover="active"
            initial="normal"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/">
              Home {(homeMatch || homeMatch2) && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/tv">
              Tv Shows {tvMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <SearchIcon
            onClick={toggleSearch}
            animate={{ x: searchOpen ? searchLocate * -1 : -25 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </SearchIcon>
          <Input
            // {...register("keyword", { required: true, minLength: 2 })}
            {...rest}
            name="keyword"
            ref={(e) => {
              if (e) {
                ref(e);
                inputRef.current = e;
              }
            }}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            transition={{ type: "linear" }}
            placeholder="검색"
            type="text"
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
