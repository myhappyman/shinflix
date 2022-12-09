import { atom, selector } from "recoil";

// Window innerWidth값 감지
export const windowWidth = atom({
  key: "windowWidth",
  default: window.innerWidth,
});

//배너 사이즈 검색 할 사이즈
export const BannerSize = selector({
  key: "bannerSize",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width < 501) {
      return "w500";
    } else {
      return "";
    }
  },
});

// Slide 한번에 보여줄 개수
export const slideCnt = selector({
  key: "slideCnt",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width > 1400) {
      return 6;
    } else if (width > 1130) {
      return 5;
    } else if (width > 900) {
      return 4;
    } else if (width > 680) {
      return 3;
    } else if (width > 250) {
      return 2;
    } else {
      return 1;
    }
  },
});
