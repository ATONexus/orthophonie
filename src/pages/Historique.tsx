import Menu from "../components/Menu/menu";
import { getSession, type Session } from "../Database/db";
import { useEffect, useState } from "react";

function Historique() {
  const [isSessions, setIsSessions] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
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
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions :", error);
      } finally {
      }
    }
    chargerSessions();
  }, []);

  return (
    <div>
      <div>Page historique</div>
      {isSessions ? (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <p>Date: {session.date}</p>
              <p>Activité: {session.activite}</p>
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

export default Historique;
