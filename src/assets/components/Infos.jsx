import './infos.css'

export default function Infos({ word, handleRemove }) {


    return(
        <>
            <div className="div-infos">
                {/* phonetic et types et remove */}
                <div className="d-flex justify-content-between">
                    {/* bloc 1 */}
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
                    {/* bloc 2 */}
                    <div className="d-flex align-items-end">
                        <button id="btn-remove" onClick={() => handleRemove(word.id)}>― remove</button>
                    </div>
                </div>
                {/* définitions */}
                <div className="div-defs">
                    <p>
                        <b className="pe-1 ps-1">1</b> {word.definition}
                        {word.secondDef && <>&nbsp;<b className="pe-1 ps-1">2</b> {word.secondDef}</>}
                        {word.thirdDef && <>&nbsp;<b className="pe-1 ps-1">3</b> {word.thirdDef}</>}
                        {word.fourthDef && <>&nbsp;<b className="pe-1 ps-1">4</b> {word.fourthDef}</>}
                    </p>
                </div>
                {/* source */}
                <div className="d-flex justify-content-between">
                    <a id="more" href={word.source}>→ more</a>
                </div>
            </div>
        </>
    )
}