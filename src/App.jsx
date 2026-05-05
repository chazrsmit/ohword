import { useReducer, useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

// sources: https://namastedev.com/blog/react-usereducer-hook-with-examples-3/ ; https://dev.to/edriso/how-to-use-the-usereducer-hook-in-react-3cjf ; https://fullstackopen.com/en/part2/getting_data_from_server

function App() {

  // import la db qui contient localement les mots
  // on utilise un useEffect
  useEffect(() => {
    axios
      .get("http://localhost:3001/words")
      .then(response => {
        dispatch({
          type: "SET_WORDS",
          payload: response.data
        })
      })
  }, [])


  // 1) définir le state initial
  const initialState = {
    words: []
    // on commence avec une liste vide de mots
  }

  // 2) définir la fonction reducer, qui contient les différentes actions à enclencher
  function reducer(state, action) {
    switch (action.type) {
      // Load la list depuis le json
      case "SET_WORDS":
        return {
          words: action.payload //on reçoit le payload qui est le response.data qui va du coup remplir l'array words.
        }
      // Ajouter un mot
      case "ADD_WORD":
        return {
          words: [...state.words, action.payload]
          // la liste words: on copie l'état de la liste avant changement, et on y ajoute le mot avec action.payload (on indique ce qu'est le payload plus bas)
        };
      // Supprimer un mot  
      case "REMOVE_WORD":
        return {
          words: state.words.filter(word => word.id !== action.payload)
        };

      default:
        return state;
    }
  }

  // 3) on appelle le useReducer, dans lequel on met la fonction reducer et l'état initial
  const [state, dispatch] = useReducer(reducer, initialState);

  // valeur que l'on tape dans le input field
  const [inputValue, setInputValue] = useState("");

  // gérer les erreurs
  const [errors, setErrors] = useState({
    duplicate: null,
    invalid: null
  });

  // on va créer une fonction qui va gérer l'ajout d'un mot, où il va falloir vérifier que le mot n'est pas dans la liste, et vérifier qu'il s'agit d'un mot valable en le cherchant dans l'API
  const handleAdd = () => {
    // s'il n'y a pas d'input on return
    if (!inputValue) return

    let hasError = false;

    //on vérifie qu'il n'y a pas d'erreur au niveau des caractrèes (avec un regex)
    const isValid = /^[A-Za-zÀ-ÿ\s]+$/.test(inputValue.trim());

    // on vérifie que le mot n'est pas déjà dans la liste
    const exists = state.words.some(word => 
      word.text === inputValue.trim()
    )

    // reset erreurs au départ
    setErrors({
      duplicate: null,
      invalidChars: null
    });

    // message validation caractères
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        invalid: "Seules les lettres sont autorisées."
        }))
      hasError = true  
    }

    // message doublon
    if (exists) {
      setErrors(prev => ({
        ...prev,
        duplicate: "Ce mot existe déjà dans la liste."
      }))
      hasError = true

    }

    if (hasError) return;

    // sinon
    const newWord = {
      text: inputValue
    }

      // on doit ajouter le mot dans la DB avant
    axios
      .post("http://localhost:3001/words", newWord)
      .then(response => {
        dispatch({
          type: "ADD_WORD",
          payload: response.data
        })
      })

    // on clear
    setInputValue('')
    setError(null)
  }

  // fonction pour supprimer un mot
  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:3001/words/${id}`)
      .then(() => {
        dispatch({
          type: "REMOVE_WORD",
          payload: id
        })
      })
  }

  return (
    <>
    <div>
    {state.words.length > 0 ? (
      state.words.map(word => (
        <>
        <li key={word.id}>{word.text}</li>
        <button onClick={() => handleRemove(word.id)}>X</button>
        </>
      )))
      :
      (<p></p>)
    }
    </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) =>
          {
            const value = e.target.value;
            setInputValue(value);

            if (value === "") {
              setErrors({
                duplicate: null,
                invalid: null
              })
            };
          }
        }
        placeholder="Type a word"
      />
      <button onClick={handleAdd}>Add a new word</button>
      {/* affichage des erreurs */}
      {errors.invalid && 
        <div>
          <p>{errors.invalid}</p>
        </div>
      }
      {errors.duplicate &&
          <div>
          <p>{errors.duplicate}</p>
        </div>
      }
    </>
  )
}

export default App
