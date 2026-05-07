import './word.css'

export default function Word({ word, handleClick, openWord }) {

    return (
        <>
            <li key={word.id} className={`li-word ${openWord === word.id && 'open'}`} onClick={() => handleClick(word.id)}>
                <p>
                    {word.text}
                </p>
            </li>
        </>
    )
}