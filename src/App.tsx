import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu/menu";
import Daily from "./pages/Daily";
import Historique from "./pages/Historique";
import Accueil from "./pages/Accueil";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/historique" element={<Historique />} />
        </Routes>
      </main>

      <Menu />
    </BrowserRouter>
  );
}

export default App;
