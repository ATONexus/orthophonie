import { useState } from "react";
import "./App.css";
import Compteur from "./components/Compteur/compteur";
import Echelle from "./components/Echelle/echelle";
import Activite from "./components/Activite/activite";
import Commentaire from "./components/Commentaire/commentaire";
import Enregistrement from "./components/Enregistrement/enregistrement";
import { getDraft, saveDraft } from "./Database/db";

type TypeActivite = "Exercice" | "Conversation";

function Daily() {
  const convIco = (
    <svg
      width="512px"
      height="512px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>ionicons-v5-j</title>
      <path d="M336,256c-20.56,0-40.44-9.18-56-25.84-15.13-16.25-24.37-37.92-26-61-1.74-24.62,5.77-47.26,21.14-63.76S312,80,336,80c23.83,0,45.38,9.06,60.7,25.52,15.47,16.62,23,39.22,21.26,63.63h0c-1.67,23.11-10.9,44.77-26,61C376.44,246.82,356.57,256,336,256Zm66-88h0Z" />
      <path d="M467.83,432H204.18a27.71,27.71,0,0,1-22-10.67,30.22,30.22,0,0,1-5.26-25.79c8.42-33.81,29.28-61.85,60.32-81.08C264.79,297.4,299.86,288,336,288c36.85,0,71,9,98.71,26.05,31.11,19.13,52,47.33,60.38,81.55a30.27,30.27,0,0,1-5.32,25.78A27.68,27.68,0,0,1,467.83,432Z" />
      <path d="M147,260c-35.19,0-66.13-32.72-69-72.93C76.58,166.47,83,147.42,96,133.45,108.86,119.62,127,112,147,112s38,7.66,50.93,21.57c13.1,14.08,19.5,33.09,18,53.52C213.06,227.29,182.13,260,147,260Z" />
      <path d="M212.66,291.45c-17.59-8.6-40.42-12.9-65.65-12.9-29.46,0-58.07,7.68-80.57,21.62C40.93,316,23.77,339.05,16.84,366.88a27.39,27.39,0,0,0,4.79,23.36A25.32,25.32,0,0,0,41.72,400h111a8,8,0,0,0,7.87-6.57c.11-.63.25-1.26.41-1.88,8.48-34.06,28.35-62.84,57.71-83.82a8,8,0,0,0-.63-13.39C216.51,293.42,214.71,292.45,212.66,291.45Z" />
    </svg>
  );
  const exoIco = (
    <svg
      width="512px"
      height="512px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>ionicons-v5-n</title>
      <path d="M459.94,53.25a16.06,16.06,0,0,0-23.22-.56L424.35,65a8,8,0,0,0,0,11.31l11.34,11.32a8,8,0,0,0,11.34,0l12.06-12C465.19,69.54,465.76,59.62,459.94,53.25Z" />
      <path d="M399.34,90,218.82,270.2a9,9,0,0,0-2.31,3.93L208.16,299a3.91,3.91,0,0,0,4.86,4.86l24.85-8.35a9,9,0,0,0,3.93-2.31L422,112.66A9,9,0,0,0,422,100L412.05,90A9,9,0,0,0,399.34,90Z" />
      <path d="M386.34,193.66,264.45,315.79A41.08,41.08,0,0,1,247.58,326l-25.9,8.67a35.92,35.92,0,0,1-44.33-44.33l8.67-25.9a41.08,41.08,0,0,1,10.19-16.87L318.34,125.66A8,8,0,0,0,312.69,112H104a56,56,0,0,0-56,56V408a56,56,0,0,0,56,56H344a56,56,0,0,0,56-56V199.31A8,8,0,0,0,386.34,193.66Z" />
    </svg>
  );
  const pouceP = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );

  const pouceN = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );

  const [compteurP, setCompteurP] = useState(0);
  const [compteurN, setCompteurN] = useState(0);
  const [severite, setSeverite] = useState(0);
  const [comm, setComm] = useState("");

  const date = new Date();
  const dateLongue = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [typeActivite, setTypeActivite] = useState<TypeActivite | null>(null);
  //Enregistrement Audio !!!

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [resDraft, setResDraft] = useState(null);

  const handleView = async () => {
    const draft = await getDraft();

    console.log("Draft :", draft);
  };

  return (
    <>
      <div className="header">
        <button
          className="save"
          onClick={() =>
            saveDraft({
              id: "current",
              date: dateLongue,
              severite: severite,
              activite: typeActivite,
              renforcementPositif: compteurP,
              renforcementNegatif: compteurN,
              commentaire: comm,
            })
          }
        >
          Enregistrer la journée
        </button>
        <button onClick={handleView}>view</button>
      </div>
      <div>
        <h3>Type d'activité</h3>
        <div className="boxActivite">
          <Activite
            nom={"Exercice"}
            icone={exoIco}
            selectionne={typeActivite === "Exercice"}
            onClick={() => setTypeActivite("Exercice")}
          />
          <Activite
            nom={"Conversation"}
            icone={convIco}
            selectionne={typeActivite === "Conversation"}
            onClick={() => setTypeActivite("Conversation")}
          />
        </div>
        <div></div>

        <div className="boxEchelle">
          <h3>Échelle de sévérité</h3>
          <Echelle severite={severite} onChange={setSeverite} />
        </div>
      </div>
      <div className="compteurs">
        <Compteur
          nom="Renforcements positifs"
          valeur={compteurP}
          couleur="positif"
          icone={pouceP}
          onIncrement={() => setCompteurP((v) => v + 1)}
          onDecrement={() => setCompteurP((v) => Math.max(0, v - 1))}
        />

        <Compteur
          nom="Renforcements négatifs"
          valeur={compteurN}
          couleur="negatif"
          icone={pouceN}
          onIncrement={() => setCompteurN((v) => v + 1)}
          onDecrement={() => setCompteurN((v) => Math.max(0, v - 1))}
        />
      </div>
      <div className="boxComm">
        <h3>Commentaire sur la journée</h3>
        <Commentaire val={comm} onChange={setComm} />
      </div>
      <div>
        <h3>Enregistrement</h3>
        <Enregistrement
          onRecordingComplete={(blob, url) => {
            setAudioBlob(blob);
            setAudioUrl(url);
          }}
        />
      </div>

      <div>
        Type activité : {typeActivite} / echelle : {severite} / compteur positif
        : {compteurP} / compteur négatif : {compteurN} / commentaire : {comm}
      </div>
    </>
  );
}

export default Daily;
