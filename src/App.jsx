import React, { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import { Mic, X } from "lucide-react";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("any");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentInputs, setRecentInputs] = useState([]);
  const [alternativeMode, setAlternativeMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [chatListening, setChatListening] = useState(false);

  const recognitionRef = useRef(null);
  const chatRecognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  const loadingMessages = [
    "Mixing your ingredients... 🍅🥑",
    "ChefBot is preheating the oven... 🔥",
    "Grabbing the spices... 🌶️",
    "Cooking up something delicious... 👨‍🍳",
    "Tasting for perfection... 😋"
  ];

  useEffect(() => {
    const sessionHistory = sessionStorage.getItem("recentInputs");
    if (sessionHistory) {
      setRecentInputs(JSON.parse(sessionHistory));
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const saveRecentInput = (input) => {
    const updated = [input, ...recentInputs.filter((i) => i !== input)].slice(0, 5);
    setRecentInputs(updated);
    sessionStorage.setItem("recentInputs", JSON.stringify(updated));
  };

  const fetchRecipes = async (altMode = false) => {
    if (!ingredients.trim()) {
      setResult("It looks like you haven't listed your ingredients yet. Please provide your available ingredients so I can suggest recipes for you.");
      return;
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const endpoint = "https://models.inference.ai.azure.com";
    const modelName = "gpt-4.1";

    const openai = new OpenAI({
      baseURL: endpoint,
      apiKey: token,
      dangerouslyAllowBrowser: true,
    });

    const randomMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setCurrentLoadingMessage(randomMsg);
    setLoading(true);
    setResult("");
    setChatHistory([]);
    saveRecentInput(ingredients);

    const messages = [
      { role: "system", content: "You are a helpful cooking assistant." },
      {
        role: "user",
        content: altMode
          ? `Please now list another 2-3 completely different and unique dishes. Do not repeat or rephrase anything from earlier. Include step-by-step instructions for each.`
          : `These are my ${mealType} ingredients: ${ingredients}.  \nPlease give me 2–3 unique recipes in the following markdown format:\n\n1. ** Recipe Title **\n\n**Ingredients:**\n- list of ingredients\n\n**Steps:**\n1. Step one\n2. Step two\n3. Step three\n\nDo not include any intro or outro text. Only return the markdown.`,
      },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: modelName,
        messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
      });

      setResult(response.choices?.[0]?.message?.content || "No recipes found.");
    } catch (err) {
      setResult("Something went wrong: " + err.message);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setAlternativeMode(false);
    await fetchRecipes();
  };

  const handleAlternative = async () => {
    if (loading) return;
    setAlternativeMode(true);
    await fetchRecipes();
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    const updatedChat = [...chatHistory, { sender: "You", text: userMessage }];
    setChatHistory(updatedChat);
    setChatLoading(true);

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const endpoint = "https://models.inference.ai.azure.com";
    const modelName = "gpt-4.1";

    const openai = new OpenAI({
      baseURL: endpoint,
      apiKey: token,
      dangerouslyAllowBrowser: true,
    });

    const messages = [
      { role: "system", content: "You are a helpful cooking assistant." },
      {
        role: "user",
        content: `The user previously received this recipe:\n\n${result}\n\nFollow-up question: "${userMessage}". Answer concisely.`,
      },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: modelName,
        messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 800,
      });

      const reply = response.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't answer that.";
      setChatHistory([...updatedChat, { sender: "ChefBot", text: reply, animate: true }]);
    } catch (err) {
      setChatHistory([...updatedChat, { sender: "ChefBot", text: "Something went wrong: " + err.message, animate: true }]);
    }

    setChatLoading(false);
  };

  const startListening = (isChat = false) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      if (isChat) {
        setChatInput(transcript);
      } else {
        setIngredients(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopListening(isChat);
    };

    recognition.onend = () => stopListening(isChat);

    if (isChat) {
      chatRecognitionRef.current = recognition;
      setChatListening(true);
    } else {
      recognitionRef.current = recognition;
      setListening(true);
    }

    recognition.start();
  };

  const stopListening = (isChat = false) => {
    const ref = isChat ? chatRecognitionRef.current : recognitionRef.current;
    if (ref) ref.stop();
    isChat ? setChatListening(false) : setListening(false);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full p-8">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">🍳 What Can I Cook?</h1>
        <p className="text-gray-600 mb-4">
          Type the ingredients you already have at home, and I’ll show you recipes you can cook with them!
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {["breakfast", "lunch", "dinner", "any"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                mealType === type ? "bg-orange-500 text-white" : "bg-white text-gray-700"
              } hover:bg-orange-100 transition`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Input section */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <div className="flex w-full gap-2">
            <input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients (e.g. eggs, tomato, cheese)"
              className="w-full p-4 text-lg border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={() => (listening ? stopListening() : startListening())}
              className="text-orange-500 border p-2 rounded-xl hover:bg-orange-100"
            >
              {listening ? <X /> : <Mic />}
            </button>
          </div>

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
                <span className="animate-spin">👨‍🍳</span> {currentLoadingMessage}
              </>
            ) : (
              "Get Recipes"
            )}
          </button>
        </form>

        {/* Result + Chat section */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">👨‍🍳 Your Recipes</h2>

            <div className="bg-orange-50 p-6 rounded-xl shadow-inner max-h-[700px] overflow-y-auto">
              <div className="prose prose-sm text-gray-800 max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>

            <button
              onClick={handleAlternative}
              className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
            >
              🔁 Give Me Different Recipes
            </button>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💬 Ask ChefBot for Help</h3>
              <form onSubmit={handleChatSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex w-full gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="e.g. Can I replace feta with mozzarella?"
                    className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => (chatListening ? stopListening(true) : startListening(true))}
                    className="text-orange-500 border p-2 rounded-xl hover:bg-orange-100"
                  >
                    {chatListening ? <X /> : <Mic />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-medium transition"
                >
                  {chatLoading ? "Replying..." : "Ask ChefBot"}
                </button>
              </form>
              <div className="mt-5 space-y-3 max-h-[500px] overflow-y-auto">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl shadow-sm transition-all duration-500 ${
                      msg.sender === "You"
                        ? "bg-gray-100 text-right text-gray-700"
                        : `bg-green-100 text-left text-green-900 ${msg.highlight ? "animate-pulse" : ""}`
                    }`}
                  >
                    <strong>{msg.sender}:</strong>
                    <div className="whitespace-pre-line mt-1">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
