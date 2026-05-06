import { useReducer, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import axios from 'axios';
import Infos from './assets/components/Infos';
import Add from './assets/components/Add';
import Word from './assets/components/Word';

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
    invalid: null,
    notFound: null
  });

  // on doit récupérer et stocker (dans le json) les valeurs par mot se trouvant dans l'API. on doit le faire pour chaque mot ajouté.
  // on crée une fonction asynchrone dans laquelle on utilise la méthode axios pour appeler et récupérer les données sur le mot pris en argument
  const fetchWordData = async (inputValue) => {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)
    //on fait donc une requête HTTP GET à l'API
    const data = response.data[0]
    // on a en réponse un objet qui contient notamment response.data qui contient toutes les infos liées à ce mot
    // et on prend le premier de la liste (le premier qui apparait)
    return {
      // et en résultat, on renoit un objet qui contient phonetic et definition
      phonetic: data.phonetic || "",
      definition: data.meanings?.[0]?.definitions?.[0]?.definition || "",
      secondDef: data.meanings?.[0]?.definitions?.[1]?.definition || "",
      thirdDef: data.meanings?.[1]?.definitions?.[0]?.definition || "",
      fourthDef: data.meanings?.[1]?.definitions?.[1]?.definition || "",
      source: data.sourceUrls?.[0] || ""
      // ?. (optional chaning) permet de faire que si quelque chose n'existe pas, le code ne casse pas (ça return undefined)
    }
  };

  // on va vérifier si le mot qu'on veut ajouter existe dans le dictionnaire:
  const checkDictionnary = async (inputValue) => {
    try {
      await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`);
      return true;
    }
    catch (err) {
      return false;
    }
  }

  // on va créer une fonction qui va gérer l'ajout d'un mot, où il va falloir vérifier que le mot n'est pas dans la liste, et vérifier qu'il s'agit d'un mot valable en le cherchant dans l'API
  const handleAdd = async () => {
    // s'il n'y a pas d'input on return
    if (!inputValue) return

    let hasError = false;

    //on vérifie qu'il n'y a pas d'erreur au niveau des caractrèes (avec un regex)
    const isValid = /^[A-Za-zÀ-ÿ\s]+$/.test(inputValue.trim());

    // on vérifie que le mot n'est pas déjà dans la liste
    const exists = state.words.some(word => 
      word.text === inputValue.trim()
    )

    const isInDictionary = await checkDictionnary(inputValue.trim());

    // reset erreurs au départ
    setErrors({
      duplicate: null,
      invalidChars: null,
      notFound: null
    });

    // message si le mot n'est pas dans le dictionnaire:
    if (!isInDictionary) {
      setErrors(prev => ({
        ...prev,
        notFound: "Ce mot n'existe pas dans le dictionnaire anglais."
      }));
      hasError = true;
    }

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

    // on récupère les champs phonetic et definition de l'API
    const wordData = await fetchWordData(inputValue)

    // on les ajoute dans le nouvel objet / mot
    const newWord = {
      text: inputValue,
      phonetic: wordData.phonetic,
      definition: wordData.definition,
      secondDef: wordData.secondDef,
      thirdDef: wordData.thirdDef,
      fourthDef: wordData.fourthDef,
      source: wordData.source
    }

      // on doit ajouter le mot dans la DB avant
    axios
      .post("http://localhost:3001/words", newWord) //envoyé au backend
      .then(response => { //réponse du backend
        dispatch({ //ajout dans le state initial
          type: "ADD_WORD",
          payload: response.data
        })
      })

    // on clear
    setInputValue('')
    setErrors({
      duplicate: null,
      invalidChars: null,
      notFound: null
    });
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

  //logique opening de la div avec les infos complémentaires
  const [openWord, setOpenWord] = useState(null); //par défaut c'est null si aucune id n'est reçue 

  // on ne veut qu'une seul div s'ouvre, donc on ne peut prendre qu'une seule id en paramètre
  const handleClick = (id) => {
    setOpenWord(prev => prev === id ? 'null' : id) // signifie : si on clique sur un mot DEJA ouvert, alors ça referme la div. sinon, ça ouvre l'autre div.

  }

  return (
    <div className="main d-flex">

      {/* colonne de gauche */}
      <div className="gauche col-6 col-lg-9 ">
      {/* 3colones system sur les écrans de plus ou égal à 992px */}
        <div className="row">
          {state.words.length > 0 ? (
            state.words.map(word => (
              // div contenant le mot + les infos
              <div className="col-12 col-lg-4">
                {/* chaque case fait l'équivalent d'un tiers sur grands écrans, et prend toute la largeur de la colonne sur mobile */}
                <div className="div-word" onClick={() => handleClick(word.id)}>
                  <Word word={word} />
                  <AnimatePresence>
                    {openWord === word.id && // on check que l'id cliquée correspond au bon mot
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        <Infos word={word} handleRemove={handleRemove} />
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>
              </div>

            )))
            :
            // si liste vide
            (<p></p>)
          }
        </div>

      </div>

      {/* colonne de droite */}
      <div className="add col-6 col-lg-3 d-flex flex-column align-items-end g-0">
        <Add inputValue={inputValue} setInputValue={setInputValue} setErrors={setErrors} handleAdd={handleAdd} errors={errors} />
      </div>
    
    </div>
  )
}

export default App
