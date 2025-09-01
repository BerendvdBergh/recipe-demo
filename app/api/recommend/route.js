export async function POST(req) {
  const { ingredients } = await req.json();

  const apiKey = process.env.SPOONACULAR_API_KEY; // note: no NEXT_PUBLIC_ prefix
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
    ","
  )}&number=5&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching from Spoonacular:", error);
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
