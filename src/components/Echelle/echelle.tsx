import "./echelle.css";


type EchelleProps = {
 severite: number;
   onChange: (valeur:number) => void;

}

function Echelle({severite,onChange}:EchelleProps) {
    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   

    return (
        <div className="echelle">
            <div className="echelle-grades">
                {grades.map((m) => (
                    <button
                        key={m}
                        className={`grade ${severite === m ? "active" : ""}`}
                        onClick={() => onChange(m)}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className="echelle-labels">
                <span>Très faible</span>
                <span>Très important</span>
            </div>
        </div>
    );
}

export default Echelle;