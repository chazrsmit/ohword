import './word.css'

export default function Word({ word }) {

    return (
        <>
            <li key={word.id} className="li-word">
                <p>
                    {word.text}
                </p>
            </li>
        </>
    )
}