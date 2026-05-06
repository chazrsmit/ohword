import './word.css'

export default function Word({ word, handleClick }) {

    return (
        <>
            <li key={word.id} className="li-word" onClick={() => handleClick(word.id)}>
                <p>
                    {word.text}
                </p>
            </li>
        </>
    )
}