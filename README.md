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

## API 정리

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

`* 니콜라스 선생님의 꿀팁!`
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
