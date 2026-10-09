import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Daily from "./pages/Daily";
import Historique from "./pages/Historique";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        <Route path="/" element={<Navigate to="/daily" replace />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/historique" element={<Historique />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
