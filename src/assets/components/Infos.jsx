import './infos.css'

export default function Infos({ word, handleRemove }) {


    return(
        <>
            <div className="div-infos">
              <p>{word.phonetic}</p>
              <p>{word.definition}</p>
              <p>{word.secondDef}</p>
              <p>{word.thirdDef}</p>
              <p>{word.fourthDef}</p>
              <a href={word.source}>read more</a>
              <button onClick={() => handleRemove(word.id)}>X</button>
            </div>
        </>
    )
}