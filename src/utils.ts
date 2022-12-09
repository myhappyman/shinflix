import blank from "./assets/images/blank.png";
import noSearchIcon from "./assets/images/noSearchIcon.png";

export function makeImagePath(id: string, format?: string) {
  if (id === "" || id === null || id === undefined) {
    return blank;
  } else {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
  }
}

export function NoSearchDataImage() {
  return noSearchIcon;
}
