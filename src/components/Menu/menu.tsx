import { NavLink } from "react-router-dom";
import { ClipboardList, House, Settings, History } from "lucide-react";
import "./menu.css";

function Menu() {
  return (
    <nav className="menu-mobile">
      <NavLink to="/" end className="menu-item">
        <span className="menu-icon">
          <House />
        </span>
        <span>Accueil</span>
      </NavLink>

      <NavLink to="/daily" className="menu-item">
        <span className="menu-icon">
          <ClipboardList />
        </span>
        <span>Séance</span>
      </NavLink>

      <NavLink to="/historique" className="menu-item">
        <span className="menu-icon">
          <History />
        </span>
        <span>Historique</span>
      </NavLink>

      <NavLink to="/parametres" className="menu-item">
        <span className="menu-icon">
          <Settings />
        </span>
        <span>Réglages</span>
      </NavLink>
    </nav>
  );
}

export default Menu;
