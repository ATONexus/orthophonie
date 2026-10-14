import {
  Calendar,
  ChartColumn,
  ChartNoAxesCombined,
  ChevronDown,
  Minus,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { getSession, type Session } from "../Database/db";
import { useEffect, useState } from "react";

import "./suivi.css";
import { type DataGraph } from "../components/Graphique/graphique";
import Graphique from "../components/Graphique/graphique";

function Suivi() {
  // const [isSessions, setIsSessions] = useState(false);
  // const [sessions, setSessions] = useState<Session[]>([]);
  const [dataGraph, setDataGraph] = useState<DataGraph[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [selection, setSelection] = useState("7 derniers jours");
  const duree = [
    { icone: <Calendar />, valeur: "7 derniers jours" },
    { icone: <Calendar />, valeur: "14 derniers jours" },
    { icone: <Calendar />, valeur: "30 derniers jours" },
  ];
  const [moyenne, setMoyenne] = useState("");
  const [positif, setPositif] = useState(0);
  const [negatif, setNegatif] = useState(0);
  const [ratio, setRatio] = useState("");
  const [tendance, setTendance] = useState<"hausse" | "baisse" | "stable">(
    "stable",
  );

  // Charger le brouillon depuis IndexedDB lors de l'ouverture de la page
  useEffect(() => {
    async function chargerSessions() {
      try {
        const sessionData = await getSession();
        console.log("Sessions récupérées :", sessionData);
        if (!sessionData || sessionData.length === 0) {
          // setIsSessions(false);
        } else {
          // setIsSessions(true);
          // setSessions(sessionData);
          calculMoyenne(sessionData);
          calculPositif(sessionData);
          calculNegatif(sessionData);
          calculRatio(sessionData);
          ajoutDataGraph(sessionData);
          calculTendance(sessionData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions :", error);
      } finally {
      }
    }
    chargerSessions();
  }, []);

  function dateJJMM(date: string) {
    const data = date.split("-");
    const newDate = data[2] + "/" + data[1];

    return newDate;
  }

  function calculTendance(data: Session[]) {
    if (data.length < 2) {
      setTendance("stable");
      return;
    }

    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    data.forEach((d, index) => {
      sumX += index;
      sumY += d.severite;
      sumXY += index * d.severite;
      sumX2 += index * index;
    });

    const denominateur = n * sumX2 - sumX * sumX;
    if (denominateur === 0) {
      setTendance("stable");
      return;
    }

    const pente = (n * sumXY - sumX * sumY) / denominateur;

    // Un seuil de 0.1 évite que le statut change pour une micro-variation
    if (pente > 0.1) setTendance("hausse");
    else if (pente < -0.1) setTendance("baisse");
    else setTendance("stable");
  }

  function ajoutDataGraph(data: Session[]) {
    // 1. On transforme le tableau entier en une seule fois
    const formattedData: DataGraph[] = data.map((d) => ({
      jours: dateJJMM(d.date), // Assurez-vous que d.date contient bien la chaîne attendue (ex: "Lun")
      severite: d.severite,
    }));

    // 2. On met à jour le state en une seule opération propre
    setDataGraph(formattedData);
  }

  function calculMoyenne(data: Session[]) {
    let total = 0;
    data.map((d) => {
      total += d.severite;
    });
    setMoyenne((total / data.length).toFixed(1));
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
      setRatio((pos / neg).toFixed(1) + " : 1");
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

      <div className="boxGraph">
        <Graphique data={dataGraph} interval={0} />
      </div>
      <div className="tendanceSeveriteBox">
        <div className="tendanceBox">
          {tendance === "hausse" && (
            <div className="tendance-box hausse">
              <TrendingUp className="tendance-icon" />
            </div>
          )}
          {tendance === "baisse" && (
            <div className="tendance-box baisse">
              <TrendingDown className="tendance-icon" />
            </div>
          )}
          {tendance === "stable" && (
            <div className="tendance-box stable">
              <Minus className="tendance-icon" />
            </div>
          )}
          <div className="tendanceTxt">
            <div className={tendance}> Tendance générale</div>
            {tendance === "hausse" && <div className="etat">Augmentation</div>}
            {tendance === "baisse" && <div className="etat">Amélioration</div>}
            {tendance === "stable" && <div className="etat">Stable</div>}
          </div>
        </div>
        <div className="tendanceBox2">
          <ChartColumn className="severite-icon" />
          <div className="severiteBox">
            <div className="severiteTxt">Sévérité Moyenne</div>
            <div className="moyenne">{moyenne}/ 10</div>
          </div>
        </div>
      </div>
      <div></div>
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
    </div>
  );
}

export default Suivi;
