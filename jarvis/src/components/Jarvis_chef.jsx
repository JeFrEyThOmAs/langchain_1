import  { useState } from 'react'
import { askJarvisChef } from '../utils/callJarvisChef.js';


export default function Jarvis_chef() {
    const [inputValue, setInputValue] = useState('')
    const [recipe, setRecipe] = useState('')

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const recipe = await askJarvisChef(inputValue)
        setRecipe(recipe)
    }
    return (
    <>
      <h1>Ask you recipe</h1>

      <form onSubmit={handleSubmit} action="">
        <input type="text" value={inputValue} onChange={handleInputChange} placeholder='ask your recipes' />
        <button>Ask</button>
      </form>
      <pre>{recipe}</pre>
    </>
  )
}
