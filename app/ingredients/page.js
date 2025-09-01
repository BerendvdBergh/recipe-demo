"use client";

import { useState } from "react";

export default function IngredientsPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredients = input.split(",").map((i) => i.trim().toLowerCase());

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-green-300 flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">🍳 Recipe Recommender</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter ingredients, separated by commas"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-md transition-colors"
        >
          Get Recipes
        </button>
      </form>

      <div className="w-full max-w-md space-y-4">
        {Array.isArray(results) && results.length === 0 ? (
          <p className="text-gray-800 text-center">No recipes found. Try adding more ingredients!</p>
        ) : (
          results.map((recipe, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold">{recipe.title || recipe.name}</h2>
              {recipe.usedIngredientCount !== undefined && (
                <p className="text-gray-600">
                  Used Ingredients: {recipe.usedIngredientCount}
                </p>
              )}
              {recipe.missedIngredientCount !== undefined && (
                <p className="text-gray-600">
                  Missing Ingredients: {recipe.missedIngredientCount}
                </p>
              )}
              <a
                href={`https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View Recipe
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
