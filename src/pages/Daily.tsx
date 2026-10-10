import { useEffect, useState } from "react";
import "./daily.css";
import Compteur from "../components/Compteur/compteur";
import Echelle from "../components/Echelle/echelle";
import Activite from "../components/Activite/activite";
import Commentaire from "../components/Commentaire/commentaire";
import Enregistrement from "../components/Enregistrement/enregistrement";
import {
  getDraft,
  clearDraft,
  saveDraft,
  saveSession,
  getSessionByDate,
} from "../Database/db";

import {
  GraduationCap,
  MessageCircleMore,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

function Daily() {
  const [charger, setCharger] = useState(false);
  const [dailySave, setDailySave] = useState(false);
  const [compteurP, setCompteurP] = useState<number>(0);
  const [compteurN, setCompteurN] = useState<number>(0);
  const [severite, setSeverite] = useState<number>(0);
  const [comm, setComm] = useState<string>("");
  const date = new Date();

  const dateLongue = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [typeActivite, setTypeActivite] = useState("");
  //Enregistrement Audio !!!

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Charger le brouillon depuis IndexedDB lors de l'ouverture de la page
  useEffect(() => {
    async function chargerDraft() {
      try {
        const draft = await getDraft();

        if (draft && draft.date === date.toISOString().slice(0, 10)) {
          setSeverite(draft.severite ?? 0);
          setTypeActivite(draft.activite ?? "");
          setComm(draft.commentaire ?? "");
          setCompteurP(draft.renforcementPositif ?? 0);
          setCompteurN(draft.renforcementNegatif ?? 0);
          setAudioBlob(draft.audio ?? null);
        } else {
          await clearDraft();
          console.log(
            "Aucun brouillon trouvé pour aujourd'hui, brouillon effacé.",
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement du brouillon :", error);
      } finally {
        setCharger(true);
      }
    }

    chargerDraft();

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

  //Sauvegarder le brouillon dans IndexedDB à chaque changement de l'état
  useEffect(() => {
    if (!charger || dailySave) return;

    async function sauvegarderDraft() {
      await saveDraft({
        id: "current",
        date: date.toISOString().slice(0, 10), // Format YYYY-MM-DD
        severite: severite,
        activite: typeActivite,
        renforcementPositif: compteurP,
        renforcementNegatif: compteurN,
        commentaire: comm,
        audio: audioBlob,
      });
    }
    console.log(audioUrl);

    sauvegarderDraft().catch(console.error);
  }, [severite, typeActivite, comm, compteurP, compteurN, audioBlob]);

  return (
    <>
      <div className="header">
        <div className="date">{dateLongue}</div>
        <div>
          {dailySave ? "Journée sauvegardée" : "Journée non sauvegardée"}
        </div>
        {dailySave ? null : (
          <button
            className="save"
            onClick={() =>
              saveSession({
                date: date.toISOString().slice(0, 10),
                severite: severite,
                activite: typeActivite,
                renforcementPositif: compteurP,
                renforcementNegatif: compteurN,
                commentaire: comm,
                audio: audioBlob ?? null,
              })
            }
          >
            Enregistrer la journée
          </button>
        )}
      </div>
      <div>
        <div className="boxActivite">
          <Activite
            nom={"Exercice"}
            icone={<GraduationCap />}
            selectionne={typeActivite === "Exercice"}
            onClick={() => setTypeActivite("Exercice")}
          />
          <Activite
            nom={"Conversation"}
            icone={<MessageCircleMore />}
            selectionne={typeActivite === "Conversation"}
            onClick={() => setTypeActivite("Conversation")}
          />
        </div>

        <div className="boxEchelle">
          <Echelle severite={severite} onChange={setSeverite} />
        </div>
      </div>
      <div className="compteurs">
        <Compteur
          nom="Renforcements positifs"
          valeur={compteurP}
          couleur="positif"
          icone={<ThumbsUp />}
          onIncrement={() => setCompteurP((v) => v + 1)}
          onDecrement={() => setCompteurP((v) => Math.max(0, v - 1))}
        />

        <Compteur
          nom="Renforcements négatifs"
          valeur={compteurN}
          couleur="negatif"
          icone={<ThumbsDown />}
          onIncrement={() => setCompteurN((v) => v + 1)}
          onDecrement={() => setCompteurN((v) => Math.max(0, v - 1))}
        />
      </div>
      <div className="boxComm">
        <Commentaire val={comm} onChange={setComm} />
      </div>
      <div className="boxEnregistrement">
        <Enregistrement
          onRecordingComplete={(blob, url) => {
            setAudioBlob(blob);
            setAudioUrl(url);
          }}
        />
      </div>
    </>
  );
}

export default Daily;
