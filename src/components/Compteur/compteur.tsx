import "./compteur.css";
import type { ReactNode } from "react";

type CompteurProps = {
  nom: string;
  valeur: number;
  couleur: string;
  icone: ReactNode;
  onIncrement: () => void;
  onDecrement: () => void;
};

function Compteur({
  nom,
  valeur,
  couleur,
  icone,
  onIncrement,
  onDecrement,
}: CompteurProps) {
  return (
    <div className={`compteur ${couleur}`}>
      {/* Nom + icône */}
      {icone}
      <h3>{nom}</h3>

      {/* Boutons + valeur */}
      <div className="compteur__actions">
        <span>{valeur}</span>
        <div className="boxCompteurs">
          <button onClick={onDecrement}>-</button>
          <button onClick={onIncrement}>+</button>
        </div>
      </div>
    </div>
  );
}

export default Compteur;
