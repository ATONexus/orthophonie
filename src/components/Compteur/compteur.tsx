import "./Compteur.css";
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
  onDecrement
}: CompteurProps) {

  return (
    <div className={`compteur ${couleur}`}>

      {/* Nom + icône */}
      <h3>
        {icone}
        {nom}
      </h3>

      {/* Boutons + valeur */}
      <div className="compteur__actions">

        <button onClick={onDecrement}>
          -
        </button>

        <span>
          {valeur}
        </span>

        <button onClick={onIncrement}>
          +
        </button>

      </div>

    </div>
  );
}

export default Compteur;