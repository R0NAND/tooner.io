import "./App.css";
import { Routes, Route } from "react-router";
import TunerPage from "./pages/TunerPage";
import Navbar from "./components/navbar/Navbar";
import AboutPage from "./pages/AboutPage";
import TabsPage from "./pages/TabsPage";
import TutorialsPage from "./pages/TutorialsPage";
import TestComponent from "./components/TestComponent";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/tuner" element={<TunerPage></TunerPage>}></Route>
        <Route
          path="/tutorials"
          element={<TutorialsPage></TutorialsPage>}
        ></Route>
        <Route path="/tabs" element={<TabsPage></TabsPage>}></Route>
        <Route
          path="/sandbox"
          element={<TestComponent></TestComponent>}
        ></Route>
        <Route path="/about" element={<AboutPage></AboutPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
