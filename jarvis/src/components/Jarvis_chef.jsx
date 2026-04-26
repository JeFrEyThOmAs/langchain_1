import  { useState } from 'react'
import { askJarvisChef } from '../utils/callJarvisChef.js';

function renderInlineBold(text) {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
}

function parseRecipeText(recipeText) {
    const lines = recipeText.split('\n').map((line) => line.trimEnd());
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (!line) {
            i += 1;
            continue;
        }

        if (/^\d+\.\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
                i += 1;
            }
            blocks.push({ type: 'ol', items });
            continue;
        }

        if (/^\*\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\*\s+/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\*\s+/, ''));
                i += 1;
            }
            blocks.push({ type: 'ul', items });
            continue;
        }

        if (/^\*\*.*\*\*$/.test(line)) {
            blocks.push({ type: 'heading', text: line.slice(2, -2) });
            i += 1;
            continue;
        }

        blocks.push({ type: 'p', text: line });
        i += 1;
    }

    return blocks;
}

export default function Jarvis_chef() {
    const [inputValue, setInputValue] = useState('')
    const [recipe, setRecipe] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (!inputValue.trim()) return
        setIsLoading(true)
        try {
            const recipe = await askJarvisChef(inputValue)
            setRecipe(recipe)
        } finally {
            setIsLoading(false)
        }
    }

    const parsedRecipe = parseRecipeText(recipe)

    return (
    <main className="jarvis-page">
      <section className="jarvis-card">
        <p className="jarvis-badge">Jarvis - 5 Minute Chef</p>
        <h1>What do you want to cook fast?</h1>
        <p className="jarvis-subtitle">
          Ask for any quick dish and Jarvis will generate a 5 minute recipe.
        </p>

        <form className="jarvis-form" onSubmit={handleSubmit} action="">
          <input type="text" value={inputValue} onChange={handleInputChange} placeholder='Ask your recipe here...' disabled={isLoading} />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Cooking...' : 'Ask Jarvis'}
          </button>
        </form>

        <section className="jarvis-output">
          <h2>Recipe</h2>
          {isLoading ? (
            <div className="jarvis-loading" role="status" aria-live="polite">
              <span className="loader-dot"></span>
              <p>Jarvis is preparing your recipe...</p>
            </div>
          ) : recipe ? (
            <div className="recipe-content">
              {parsedRecipe.map((block, index) => {
                if (block.type === 'heading') {
                  return <h3 key={index}>{renderInlineBold(block.text)}</h3>;
                }
                if (block.type === 'p') {
                  return <p key={index}>{renderInlineBold(block.text)}</p>;
                }
                if (block.type === 'ul') {
                  return (
                    <ul key={index}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{renderInlineBold(item)}</li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === 'ol') {
                  return (
                    <ol key={index}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{renderInlineBold(item)}</li>
                      ))}
                    </ol>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <p className="recipe-placeholder">Your recipe will appear here...</p>
          )}
        </section>
      </section>
      
      
    </main>
  )
}
