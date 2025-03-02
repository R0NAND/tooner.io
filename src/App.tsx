import "./App.css";
import { Routes, Route } from "react-router";
import TunerPage from "./pages/TunerPage";
import Navbar from "./components/navbar/Navbar";
import AboutPage from "./pages/AboutPage";
import TabsPage from "./pages/TabsPage";
import TutorialsPage from "./pages/TutorialsPage";
import TestComponent from "./components/TestComponent";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="app-content">
        <Routes>
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
      </div>
    </>
  );
}

export default App;
