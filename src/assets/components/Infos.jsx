

export default function Infos({ word, handleRemove }) {


    return(
        <>
            <div>
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