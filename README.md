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
