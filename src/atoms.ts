import { atom } from "recoil";

export const windowWidth = atom({
  key: "windowWidth",
  default: window.innerWidth,
});
