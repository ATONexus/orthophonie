import { getSession, type Session } from "../Database/db";
import { useEffect, useState } from "react";

function Suivi() {
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
      <div>Suivi</div>
      <div>Box header button 7, 15 30 jours</div>
      <div>Graph evolution</div>
      <div>tendances</div>
      <div>Moyenne sévérité</div>
      <div>renforcements avec positif + négatif + ratio</div>

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

export default Suivi;
