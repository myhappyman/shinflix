import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilState } from "recoil";
import { windowWidth } from "./atoms";
import Header from "./Routes/Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  const [width, setWidth] = useRecoilState(windowWidth);
  console.log(width);
  useEffect(() => {
    const debouncedResizeHandler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, []);
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/search/:menuName/:id" element={<Search />}></Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/banner/:id" element={<Tv />}></Route>
        <Route path="/tv/tvShowList/:id" element={<Tv />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home/:listType/:id" element={<Home />}></Route>
        <Route path="/home/banner/:id" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
