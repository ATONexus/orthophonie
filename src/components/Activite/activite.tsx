import "./activite.css";
import type { ReactNode } from "react";

type ActiviteProps = {
  nom: string;
  icone: ReactNode;
  selectionne: boolean;
  onClick: () => void;
};

function Activite({ nom, icone, selectionne, onClick }: ActiviteProps) {
  return (
    <div
      className={`activity-card ${selectionne ? "selected" : ""}`}
      onClick={onClick}
    >
      {/* Icône */}
      <div className="activity-icon">{icone}</div>

      {/* Nom */}
      <span className="activity-name">{nom}</span>

      {/* Radio */}
      <div className="activity-radio">
        {selectionne && <div className="activity-radio-inner" />}
      </div>
    </div>
  );
}

export default Activite;
