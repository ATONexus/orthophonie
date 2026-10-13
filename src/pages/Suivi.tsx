import {
  Calendar,
  ChartNoAxesCombined,
  ChevronDown,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { getSession, type Session } from "../Database/db";
import { useEffect, useState } from "react";

import "./suivi.css";

function Suivi() {
  const [isSessions, setIsSessions] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [ouvert, setOuvert] = useState(false);
  const [selection, setSelection] = useState("7 derniers jours");
  const duree = [
    { icone: <Calendar />, valeur: "7 derniers jours" },
    { icone: <Calendar />, valeur: "14 derniers jours" },
    { icone: <Calendar />, valeur: "30 derniers jours" },
  ];
  const [moyenne, setMoyenne] = useState(0);
  const [positif, setPositif] = useState(0);
  const [negatif, setNegatif] = useState(0);
  const [ratio, setRatio] = useState("");

  // Charger le brouillon depuis IndexedDB lors de l'ouverture de la page
  useEffect(() => {
    async function chargerSessions() {
      try {
        const sessionData = await getSession();
        console.log("Sessions récupérées :", sessionData);
        if (!sessionData || sessionData.length === 0) {
          setIsSessions(false);
        } else {
          setIsSessions(true);
          setSessions(sessionData);
          calculMoyenne(sessionData);
          calculPositif(sessionData);
          calculNegatif(sessionData);
          calculRatio(sessionData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions :", error);
      } finally {
      }
    }
    chargerSessions();
  }, []);

  function calculMoyenne(data: Session[]) {
    let total = 0;
    data.map((d) => {
      total += d.severite;
    });
    setMoyenne(total / data.length);
  }

  function calculPositif(data: Session[]) {
    let total = 0;
    data.map((d) => {
      total += d.renforcementPositif;
    });
    setPositif(total);
  }

  function calculNegatif(data: Session[]) {
    let total = 0;
    data.map((d) => {
      total += d.renforcementNegatif;
    });
    setNegatif(total);
  }

  function calculRatio(data: Session[]) {
    let pos = 0;
    let neg = 0;

    data.map((d) => {
      pos += d.renforcementPositif;
      neg += d.renforcementNegatif;
    });
    if (neg === 0) {
      setRatio(pos + " : 0");
    } else {
      setRatio(pos / neg + " : 1");
    }
  }

  return (
    <div>
      <div className="accueil-container">
        <ChartNoAxesCombined className="heart" />
        <div className="accueil-text">
          <h1>Mon suivi</h1>
          <p>suivi</p>
        </div>
      </div>
      <div className="dropdown">
        <button
          className="firstButton"
          type="button"
          onClick={() => setOuvert(!ouvert)}
        >
          {duree.find((a) => a.valeur === selection)?.icone} {selection}
          <ChevronDown />
        </button>

        {ouvert && (
          <div className="dropdown-menu">
            {duree.map((activite) => (
              <button
                type="button"
                key={activite.valeur}
                onClick={() => {
                  setSelection(activite.valeur);
                  setOuvert(false);
                }}
              >
                {activite.icone} {activite.valeur}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>Graph evolution</div>
      <div>tendances</div>
      <div>
        <div>Moyenne sévérité</div>

        <div>Moyenne : {moyenne}</div>
      </div>
      <div className="megarenfobox">
        <div className="renfoBox">
          <Star className="star" />
          <div className="renfoTxt">
            <div className="renfoTitre">Renforcements</div>
            <div className="renfoDesc">ratio positif / négatif</div>
          </div>
          <div className="renfo vert">
            <ThumbsUp className="ico" />
            <div className="positif">{positif}</div>
          </div>
          <div className="renfo rouge">
            <ThumbsDown className="ico" />
            <div className="negatif">{negatif}</div>
          </div>
        </div>
        <div className="ratioBox">
          <progress className="ratio" max={positif + negatif} value={positif} />
          <div className={`ratioTxt ${positif > negatif ? "vertR" : "rougeR"}`}>
            Le ratio est de {ratio}
          </div>
        </div>
      </div>

      {isSessions ? (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <p>Date: {session.date}</p>
              <p>Activité: {session.activite}</p>
              <p>Severite: {session.severite}</p>
              <p>Rénforcement positif: {session.renforcementPositif}</p>
              <p>Rénforcement négatif: {session.renforcementNegatif}</p>
              <p>Commentaire: {session.commentaire}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune session trouvée.</p>
      )}
    </div>
  );
}

export default Suivi;
