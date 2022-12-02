export function makeImagePath(id: string, format?: string) {
  if (id === "") {
    return `/assets/images/blank2.png`;
  } else {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
  }
}
