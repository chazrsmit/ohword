import './add.css'

export default function Add({ inputValue, setInputValue, setErrors, handleAdd, errors }) {

    return (

        <>
        
        <textarea
          id="add-input"
          className=""
          type="text"
          value={inputValue}
          onChange={(e) =>
            {
              const value = e.target.value;
              setInputValue(value);

              if (value === "") {
                setErrors({
                  duplicate: null,
                  invalid: null,
                  notFound: null
                })
              };
            }
          }
          placeholder="Type a Word"
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

        {errors.notFound &&
          <div>
            <p>{errors.notFound}</p>
          </div>
        }

        </>
    )
}