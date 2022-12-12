# Challenge Result🚀

#### -추가 챌린지 진행하면서 발생하는 이슈 정리하기

##### -Slider 위치변경, boolean값, 숫자값 연산에 따른 차이 발생이슈

~useState를 생성해서 앞으로 가는 슬라이더인지 뒤로 가는 슬라이더인지 구분처리함.
boolean값으로 처리해서 오른쪽 클릭은 true, 왼쪽은 false처리했는데, 이런식으로 구성하니,
useState값을 찍어봤을때 바로바로 반영이 안되어서 방향이 바뀔때마다 Slide Animate가 꼬이는 현상 발생~
boolean 값으로 인한 오류인줄 알았으나 Slider.tsx에서 페이징 계산을 하는 부분안에서 set함수인 useState로 값을 변경하고 방금 변경된 값을 가지고 페이징 계산을 하면서 발생한 이슈였다.
페이징 계산은 파라미터로 방금 들어온 값으로 체크를 해주자. 새롭게 렌더링되면서 이전 useState값으로 계산하다보니 페이징연산이 꼬인다!

1, -1값으로 값 변경하여 구분 처리해주니 정상동작함.

한번 값이 바뀔때는 정상동작하지 않음. 이때 exit가 유지되면서 꼬이는데, 이런 경우에도 잘 동작되도록 하기 위해서
`*연산`으로 처리하는게 좋을것같음

##### -Slider layoutId 연결 처리시

기존 UI와 새로 생기는 팝업에는 position 속성이 없도록 처리해야함. transform속성이 자연스럽게 적용되는데,
이때문에 기존 UI에 영향을 받아서 자리가 이동하는 현상이 발생할 수 있음.

##### -Router issue

github에 deploy까지 처리하고 나니 Home쪽에 기본 URL이 클릭해서 이동하는게 아니면 초기값이 뜨지 않았다.
`<Router basename={process.env.PUBLIC_URL} />` router basename처리 후 정상동작을 확인했다.

##### -Slider position issue

슬라이더 relative와 absolute를 통해 위치를 고정시킨 후 해당 위치에서 motion의 도움을 받아 슬라이더 쇼 형태를 만들었는데, 여러개를 만들면서 겹쳐지는 현상이 있었다.
absolute의 영역 덩어리의 사이즈가 없다보니 겹치는 현상이였는데, 이런 경우 꼭 height등으로 영역의 사이즈를 잡아줘서 겹치지 않도록 하자. position다시 한번 공부할것...
css 학습 필요 ㅠㅠ

##### -react hook form에서 register로 적용한 input에 ref값을 걸고 알아내기

```JSX
import { useRef } from "react";
import { Link, useMatch, PathMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  keyword: string;
}

function Header() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: {
      keyword: "",
    },
  });
  const { ref, ...rest } = register("keyword");
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };
  return (
    <Search onSubmit={handleSubmit(onValid)}>
      <Input
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
        placeholder="Search for moive or tv show"
        type="text"
      />
    </Search>
  );
}

export default Header;
```

register를 선언하여 name값을 만들고 ref값을 추출하여 input태그에 ref props에서 조건문으로
존재하는 경우에만 current값을 넣는형식으로 처리한다...
별거 아닌데 typescript가 아직 익숙치 않아 한참 헤맨 처리방법 ㅠㅠ width값을 알아내기 위해 사용했다.

##### -모바일 반응형 input 키보드 밀림 현상

모바일 반응형시 기본 높이값이 강제값이 없으면 input의 입력하는 키보드 입력창때문에 UI가 밀리는 현상이 발생할수있다.

# 0. ShinFlix start!

드디어 넷플릭스 클론 코딩을 시작합니다.

# 1. Header part one

react-router-dom을 통해 경로 세팅을 진행합니다.
컴포넌트와 라우터를 구성하여 작성하였다.
간단하게 공통으로 사용되는 header를 작성함

# 2. Header part two

svg내 애니메이트 처리와 헤더를 완성해볼것이다.
또 라우터에 따라 해당 위치에 동그라미 표시를 해줄 예정이다.

framer로 variants를 작성할 때 object로 작성해주는데 opacity와같은 값이 `0 > 1 > 0` 순서대로 변경되길 원한다면 배열형태로 적어주고 `repeat:Infinity` 해주면 된다.

```Typescript
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
```

Router를 구성할때 `"/"` 기본 위치가 가장 마지막에 있어야 정상적으로 Link가 동작한다!

### _React Router 6version_

#### - useRouteMath

1.  `useMatch`로 변경되었다.
    1-1. PathMatch와 같이 사용하면 된다.
2.  "/" 상대경로로 작성하지 않아도 된다.
3.  isExact가 사라졌고 알아서 비교해준다.

# 3. Header part Three

이어서 헤더에 애니메이션효과와 기능을 추가해본다.
css속성 `transform-origin`은 변화가 시작되는 위치를 지정할 수 있다.

# 4. Header part Four

#### useAnimation

기존에 개발해오던 방식처럼 특정 코드를 통해 강제로 애니메이션을 동작시키고 싶을때 사용할 수 있다.
(jQuery Animate와 비슷한 느낌)

```JSX
import { motion, useAnimation } from "framer-motion";

function Header(){
    const inputAnimation = useAnimation();
    const toggleSearch = () => {
        if(searchOpen){
            //trigger the close animation
            inputAnimation.start({
                scaleX:0,
            });
        }else{
            //trigger the open animation
            inputAnimation.start({
                scaleX:1,
            });
        }
        setSearchOpen(prev => !prev);
    }
    return (
      <Search>
        <Input
            animate={inputAnimation}
            transition={{type:"linear"}}
            placeholder="Search for moive or tv show"
            type="text"
        />
      </Search>
    );
}
```

animate에 useAnimation을 걸어주고 처리해주고 싶은부분에서 start메소드 안에 obect형태로 처리하고 싶은 애니메이션을 넣어주면 된다.

#### ~useViewportScroll~, useScroll

useViewportScroll은 declare처리 됨. 이제 useScroll을 사용하자!

##### -scroll`*`Progress

x, y축에 대한 스크롤 진행도를 `0~1` 사이 값으로 보여준다.

##### -scrollY, scrollX

퍼센트가 아닌 실제값으로 보여준다.

# 5. Home Screen part One

홈 화면을 만듭니다.
메인이 될 큰 영화 포스터와 영화들의 많은 슬라이더를 만들 예정이며 해당 데이터는 themoviedb.org에서 가져옵니다.

다양한 영화정보나 tv show등 정보를 api를 통해 얻어올 수 있습니다.

데이터를 수집하기 위해 react-query를 사용할 것이다.
쿼리 클라이언트를 작성합니다.

## API Info

#### -BASE URL

https://api.themoviedb.org/3/

#### -이미지 요청(오리지널 사이즈)

https://image.tmdb.org/t/p/original/

# 6. Home Screent part two

interface로 api에서 전달받는 데이터들의 타입을 구성하고 useQuery에 적용시켜준다.
각각 전달받은 데이터를 통해 UI를 꾸며주고 제목과 요약글을 적용하였다.

백그라운드 이미지처리를 위해 도움을 줄 함수를 작성한다.

```Typescript
//utils.ts
export function makeImagePath(id:string, format?:string){
    return `https://image.tmdb.org/t/p/${format?format:"original"}/${id}`;
}
```

이미지 요청 url에 사이즈별 차이를 두기위해 해당부분은 포맷으로 처리한다.
포맷에 요청이 없는 경우에는 original사이즈로 받도록 처리를 해주고 id에 따라 원하는 이미지를 요청해올 수 있도록 구성하였다.

<strong>\* 니콜라스 선생님의 꿀팁!</strong><br/>
배경에 이미지를 넣게되면 이미지 색상에 따라 앞에 표기한 글씨들이 안보이는 경우가 있는데, 이런 경우 linear-gradient효과와 동시에 처리를 해주면 좀 더 멋있게 이미지 표시와 글씨가 명확하게 보이도록 설정을 할 수 있다.

```JSX
const Banner = styled.div<{ bgPhoto:string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),
                url( ${props => props.bgPhoto} );
    background-size: cover;
`;
```

# 7. Slider part One

메인 내용은 끝났으니 하단의 영화 슬라이더 부분을 작성해본다.
grid레이아웃에 motion을 활용하여 레이아웃을 만들 예정이고,
AnimatePresence를 통해 사라지는 컴포넌트들에 대해서 애니메이트를 줄 예정이다.

여러개의 grid를 한번에 파싱해서 애니메이트를 해도 되지만 key만 바뀌어도 새로운 데이터가 들어왔다고 인식되는 motion을 활용해서 당장 필요한 6개 정도의 이미지 슬라이더만 노출시키도록 한다.

슬라이더에 값을 처리했지만, 화면 사용자의 넓이를 받아온게 아닌 임의의 값을 처리했기때문에, 사용자의 화면에 따라 제대로 동작이 안될 수 있다.

이럴땐 window.innerWidth 자바스크립트를 그냥 넣어주면 된다.

# 8. Slider part two

이번장에서는 작성한 슬라이더의 문제점들을 고쳐보겠다.
더블클릭 형태로 빠르게 애니메이트를 처리하다보면 큰 간격이 발생하는 상태로 넘어가는걸 볼 수 있다. exit가 발생하는 도중에 새로운 Row가 또 exit가 동시에 중첩되서 발생하는 현상이다.

이런 현상을 막기위해 boolean state를 생성해서 관리를 한다.
하지만, 이런 코드도 처음 한번만 동작하고 이후에는 제대로 동작이 안되는걸 볼 수 있는데 끝난시점에서 초기화를 해주지 않기때문이다.

#### -AnimatePresence

##### -onExitComplete

`<AnimatePresence>`의 prop 중 `onExitComplete`에 원하는 함수를 동작시키면 애니메이트의 exit가 끝나는 시점에 특정 함수를 동작시킬 수 있다. 여기서 초기화를 해주면 완벽하게 exit가 끝나고 다시 false처리를 해주어서 무한으로 슬라이더 동작을 연결할 수 있게 된다.

```JSX
function Home() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => { // 동작 제한
    if (leaving) return;
    setLeaving(true);
    setIndex((prev) => prev + 1);
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Slider>
      {/* onExitComplete를 통해 exit가 끝나는 시점을 찾는다. */}
      <AnimatePresence onExitComplete={toggleLeaving}>
        ...
      </AnimatePresence>
    </Slider>
  );
}
```

두번쨰 문제로 movie리스트들이 오른쪽에서 처음부터 주르륵 들어오는데 hidden값의 initial로 시작하기 때문이다.

##### - initial

이것 또한, `<AnimatePresence>`의 prop 중 `initial`을 사용하면 해결 할 수 있다.

```JSX
// false를 주면 initial 설정을 하지 않고 시작한다.
<AnimatePresence initial={false} />
```

이렇게 설정해주면 처음에 오른쪽에서 hidden으로 부터 시작하지 않고 제자리에서 동작하게 된다.

- 페이징 처리해보기

```Typescript
const offset = 6; // 페이지당 보여줄 개수
let page = 0; // index 현재의 페이지 0,1,2,3
const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

arr을 6개 단위로 쪼개본다고 했을때, offset과 page를 활용하여 짤라볼 것이다.
slice메소드를 사용하면 된다.
arr.slice(page*offset, page*offset+offset); // 첫번째 페이지 [1, 2, 3, 4, 5, 6]

page += 1;
arr.slice(page*offset, page*offset+offset); // 두번째 페이지 [7, 8, 9, 10, 11, 12]

page += 1;
arr.slice(page*offset, page*offset+offset); // 세번째 페이지 [13, 14, 15, 16, 17, 18]
```

<strong>\* 타입스크립트 팁</strong><br/>
`styled(motion.div)<{bgPhoto:string}>`
()가 있으면 오른쪽 옆에 작성해준다.

# 9. Box Animations part One

슬라이더 박스에 hover시 스케일이 커지는 효과를 작성해봅니다.
`<Box />` 컴포넌트가 motion으로 만들어졌기때문에 컴포넌트 자체에 바로 작성을 해도 되지만 이렇게 되면
transition이 전부다 동작하게 되어서 마우스를 올린 경우에만 딜레이를 주고싶을때는 variants로 명확하게 구분을 해줘야합니다.
variants로 애니메이트를 설정하고 hover시에만 transition을 주게되면 마우스를 올리는 도중에만 delay처리가 가능합니다.

```Typescript
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    transition: {
      delay: 2,
    },
  },
};
```

뭐 사실 whileHover쪽에 복잡하게 variants에서 작업한걸 직접 써줘도 되긴하지만... 가독성과 추후 수정을 위해서라도 variants를 써주자.

<strong>\*또 한번 css꿀팁...!!! transform-origin 활용하기</strong><br/>
슬라이더의 첫번째와 마지막은 Scale시 왼쪽 오른쪽이 커지면서 잘리는데 이런 현상을 막기 위해
transform-origin을 css에서 활요해주면 기가막히게 처리가 가능하다.

```Typescript
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: #fff;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  font-size: 40px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
```

# 10. Box Animations part two

`Box` 컴포넌트에 마우스를 올리면 발생하는 카드를 작성해보도록 합니다.
framer의 특징으로 부모에 variants가 걸려있다면 자식노드에도 동일한 애니메이트가 걸려있다.

해당 특징을 활용하여 hover시 동작할 이름을 동일하게 맞추고 variants만 새롭게 넣어주면 추가적으로 동작하는 애니메이트를 처리할 수 있다.

```JSX
// 부모
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

// 자식
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

return (
        <Box
          variants={boxVariants}
          initial="normal"
          whileHover="hover"
          transition={{ type: "tween" }}
        >
          <Info variants={infoVariants} />
        </Box>
);
```

# 11. Movie Modal

#### -react-router-dom

##### -useNavigate

router 6로 변경되면서 useHistory가 useNavigate로 변경됨.

###### -~push~

useHistory에는 push라는 메소드가 존재한다.
push메소드 argument에 써준 string으로 url을 변경해준다.
useNavigate로 변경되면서 해당 메소드는 declare처리 되었고, useNavigate를 바로 사용해주면 된다.

```Typescript
const navigate = useNavigate();
navigate(`/movies/${movieId}`);
```

#### 다중 path <Route />처리

router5이하에서는 path에 `{["/", "/movies/:movieId"]}` 형태로 처리가 가능했다.

```JSX
<Route path={["/", "/movies/:movieId"]}></Route>
```

router6이상에서는 아래처럼 변경되었다.

```JSX
<Route path="/"></Route>
<Route path="/movies/:movieId"></Route>
```

이후 useMatch를 사용하여 bigMovieMatch의 값이 일치하는 경우에만 modal을 띄우도록 만들었다.
좀 더 인터렉티브한 처리를 위해 layoutId를 사용하여 각 영화 박스와 모달에 layoutId를 설정하였고, 해당값은 영화별 pk값인 movie.id를 사용하였다.
다만, 전달받은 값은 number형태이니 string으로 변경처리를 해주어야 한다.

# 12. Movie modal part Two

이번엔 overlay라는 모달 바깥 영역을 만들고 해당 영역을 클릭하면 Home으로 초기화 되도록 만들어 본다.
모달 overlay이므로 position fixed로 꽉차도록 처리한다.
onClick이벤트에는 navigator를 연결하여 `"/"` 또는 `-1`로 처리하여 goBack처리를 해준다.

```
navigate("/");
navigate(-1);
```

정중앙 정렬을 위해

```CSS
/* 자주쓰던 정중앙 정렬방식 motion에선 안먹힐수있다. */
div{
  position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
}
```

해당 방식을 많이 사용하는데, layoutId등 framer를 통해 애니메이트를 걸게되면, transform을 사용하면서 css쪽에서 처리한 값이 적용되지 않는 현상이 있다.

useScroll을 사용하여 위치값을 잡거나, fixed와 margin:0 auto를 활용한 방식으로 처리해야한다.

```CSS
/* 변경 후 동작되는 가운데 정렬 */
div{
  position: "fixed", width: "40vw", height: "80vh",
  top: "50px", left: 0, right: 0, margin: "0 auto"
}
```

## API Info

#### -Movie Info Detail

BASE_URL + `/movie/{movieId}`
영화에 대한 상세정보를 더 많이 준다.
코드챌린지로 해당 정보를 상세하게 가져와서 노출되도록 해보자.

# 13. Movie Modal part Three

클릭한 영화와 데이터의 정보가 일치할때 해당 내용을 기반으로 모달 팝업에 백그라운드 이미지와 제목 요약을 간단하게 작성하여 상세 모달을 작성해보았다.

# 14. Search Redirect

react-hook-form의 useForm을 사용하여 register, handleSubmit을 사용하여 검색창을 만들고, react-router-dom을 통해 search컴포넌트로 이동시켜서 전달받은 파라미터를 가져오도록 하였다.

#### -useForm

##### -register, handleSubmit

register를 등록하는것만으로 input태그의 입력과 제약조건, 유효성 검사 등 다양한 설정을 할 수 있다.
handleSubmit은 2개의 파라미터를 받는데 첫번째 인자는 필수값으로 유효한 경우 동작되는 메소드를 넣고 두번째는 실패했을 경우 동작할 파라미터를 넣어주면 된다.

#### -useLoaction

해당값을 통해 해당 페이지에 전달받은 값들을 받아올 수 있는데, search값에는 파라미터값이 보이고 해당값을 split 등을 통해 구분지어 변수값과 key값을 구분지을수 있는데, 이것은 다소 복잡하고 귀찮은 작업이다. 이럴때 URLSearchParameter를 사용하면 된다.

#### -URLSearchParameter

해당 기능은 순수 Javascript이다.(react가 아님)
여러개의 `?key=value&key=value` 형태로 들어온 url정보를 key값의 `get()`를 통해 값을 가져올수 있다.

```javascript
const search = new URLSearchParams("?keyword=dune&region=kr");
search.get("keyword"); // 'duen'
search.get("region"); // 'kr'
```

## API Info

#### -Search관련 doc

https://developers.themoviedb.org/3/search/search-companies

https://developers.themoviedb.org/3/search/search-keywords

# 15. Conclusions

드디어 공식 강의는 끝
앞으로 내가 원하는 형태로 챌린지를 구성하고 작성해서 포트폴리오 결과물로 작성하면 된다.

1. Slide Show 좌우 화살표 형태의 UI 구성하기
   1-1. 스크롤터짐 극복하기
2. 영화 정보 클릭시 상세 API요청하여 더 상세하게 구성한 모달 팝업 작성해보기
3. Tv Shows등 다양한 카테고리 영상 리스트 구성하기
4. 검색기능으로 이동시

추가적으로 생성하고 싶은 챌린지가 생기면 추가예정임
