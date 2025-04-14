import React, { useState, useEffect } from "react";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("any");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [alternativeMode, setAlternativeMode] = useState(false);
  const [recentInputs, setRecentInputs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("recentInputs");
    if (stored) {
      setRecentInputs(JSON.parse(stored));
    }
  }, []);

  const saveRecentInput = (input) => {
    const updated = [input, ...recentInputs.filter(i => i !== input)].slice(0, 5);
    setRecentInputs(updated);
    sessionStorage.setItem("recentInputs", JSON.stringify(updated));
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setResult("");
    setChatHistory([]);
    saveRecentInput(ingredients);

    try {
      const res = await fetch("http://localhost:5000/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ingredients, mealType, alternativeMode })
      });

      const data = await res.json();
      setResult(data.text || "No recipes found.");
    } catch (err) {
      setResult("Something went wrong: " + err.message);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlternativeMode(false);
    await fetchRecipes();
  };

  const handleAlternative = async () => {
    setAlternativeMode(true);
    await fetchRecipes();
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    const updatedChat = [...chatHistory, { sender: "You", text: userMsg }];

    try {
      const res = await fetch("http://localhost:5000/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          followUp: userMsg,
          result
        })
      });

      const data = await res.json();
      const reply = data.text?.trim() || "Sorry, I couldn't answer that.";
      updatedChat.push({ sender: "ChefBot", text: reply });
    } catch (err) {
      updatedChat.push({ sender: "ChefBot", text: "Something went wrong: " + err.message });
    }

    setChatHistory(updatedChat);
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full p-8">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">🍳 What Can I Cook?</h1>
        <p className="text-gray-600 mb-4">
          Type the ingredients you already have at home, and I’ll show you recipes you can cook with them!
        </p>

        {/* Meal Type Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {["breakfast", "lunch", "dinner", "any"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                mealType === type
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700"
              } hover:bg-orange-100 transition`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g. eggs, tomato, cheese)"
            className="w-full p-4 text-lg border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {recentInputs.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {recentInputs.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setIngredients(item)}
                  className="bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">👨‍🍳</span> Cooking...
              </>
            ) : (
              "Get Recipes"
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">👨‍🍳 Your Recipes</h2>
            <div className="bg-orange-50 p-6 rounded-xl shadow-inner whitespace-pre-wrap text-gray-800 font-medium leading-relaxed max-h-[500px] overflow-y-auto">
              {result}
            </div>

            <button
              onClick={handleAlternative}
              className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
            >
              🔁 Give Me Different Recipes
            </button>

            {/* Chat Section */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💬 Ask ChefBot for Help</h3>

              <form onSubmit={handleChatSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g. Can I replace feta with mozzarella?"
                  className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-medium transition"
                >
                  {chatLoading ? "Replying..." : "Ask ChefBot"}
                </button>
              </form>

              <div className="mt-5 space-y-3 max-h-[400px] overflow-y-auto">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl shadow-sm ${
                      msg.sender === "You"
                        ? "bg-gray-100 text-right text-gray-700"
                        : "bg-green-100 text-left text-green-900"
                    }`}
                  >
                    <strong>{msg.sender}:</strong>{" "}
                    <span className="whitespace-pre-line">{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
