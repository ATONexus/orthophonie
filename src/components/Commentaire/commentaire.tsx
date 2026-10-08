import "./commentaire.css"

type CommentaireProps = {
    val: string;
    onChange:(valeur:string) => void;
}

function Commentaire ({val,onChange}:CommentaireProps) {

    return(
        <div className="boxDesc">
            <textarea
            value={val}
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Ajouter un commentaire..."/>
        </div>
    )
}

export default Commentaire