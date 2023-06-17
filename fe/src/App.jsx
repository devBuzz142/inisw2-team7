import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EditPage from "./pages/EditPage";
import ResultPage from "./pages/ResultPage";
import SubtitleProvider from "./context/SubtitleProvider";

function App() {
  return (
    <>
      <SubtitleProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/*" element={<Navigate replace to="/home" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SubtitleProvider>
    </>
  );
}

export default App;
