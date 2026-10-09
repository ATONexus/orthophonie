import {
  HeartPulse,
  CalendarCheck,
  ChartColumn,
  MessageCircleQuestionMark,
} from "lucide-react";
import "./accueil.css";
import { getSessionByDate } from "../Database/db";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Accueil() {
  // Charger le brouillon depuis IndexedDB lors de l'ouverture de la page

  const [dailySave, setDailySave] = useState(false);

  useEffect(() => {
    async function checkDailySave() {
      try {
        const dailySave = await getSessionByDate(
          new Date().toISOString().slice(0, 10),
        );

        if (dailySave) {
          setDailySave(true);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de la sauvegarde quotidienne :",
          error,
        );
      }
    }

    checkDailySave();
  }, []);

  return (
    <div>
      <div className="accueil-container">
        <HeartPulse className="heart" />
        <div className="accueil-text">
          <h1>Lindcomb</h1>
          <p>suivi quotidien</p>
        </div>
      </div>
      <div className="accueil-content">
        <div className="accueil-titre">Bonjour Timéo,</div>
        <div className="accueil-message">
          {dailySave
            ? "Bravo tu as terminé ta séance !"
            : "Pret pour aujourd'hui ?"}
        </div>
      </div>
      <div className="accueil-card-container">
        <NavLink to="/Daily" end className="accueil-item">
          <div className="accueil-card">
            <CalendarCheck className="accueil-card-icon" />
            <div className="accueil-card-titre">Séance du jour</div>
            <div
              className={`accueil-card-message ${dailySave ? "fini" : "draft"}`}
            >
              {dailySave ? "Séance terminée" : "Séance non commencée"}
            </div>
          </div>
        </NavLink>
        <NavLink to="/Historique" end className="accueil-item">
          <div className="accueil-card">
            <ChartColumn className="accueil-card-icon" />
            <div className="accueil-card-titre">Historique</div>
          </div>
        </NavLink>
        <NavLink to="/Aide" end className="accueil-item">
          <div className="accueil-card">
            <MessageCircleQuestionMark className="accueil-card-icon" />
            <div className="accueil-card-titre">Aide</div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Accueil;
