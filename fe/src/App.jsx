import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import EditPage from "./pages/EditPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
