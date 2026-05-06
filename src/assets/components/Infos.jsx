import './infos.css'

export default function Infos({ word, handleRemove }) {


    return(
        <>
            <div className="div-infos">
                <div className="d-flex">
                    {word.phonetic && 
                        <div className="me-3">
                            <p id="phonetic">{word.phonetic}</p>
                        </div>
                    }
                    <div className="types d-flex gap-1">
                        (
                        <p>{word.typeOne}</p>
                        {word.typeTwo &&
                        <div className="d-flex gap-1">
                            <p>•</p>
                            <p>{word.typeTwo}</p>
                        </div>
                        }
                        )
                    </div>
                </div>
              <p>{word.definition}</p>
              <p>{word.secondDef}</p>
              <p>{word.thirdDef}</p>
              <p>{word.fourthDef}</p>
              <a href={word.source}>read more</a>
              <button onClick={() => handleRemove(word.id)}>remove</button>
            </div>
        </>
    )
}