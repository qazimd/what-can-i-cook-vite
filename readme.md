# 🍳 What Can I Cook?

A simple AI-powered web app built with React + Vite that helps users discover recipes based on the ingredients they already have at home.

## 🔍 Features

- 🧠 Uses Cohere's AI model to generate step-by-step recipes
- 🕹️ Meal type selector: Breakfast, Lunch, Dinner, or Any
- 📌 Recent input history (last 5 entries stored per session)
- 💬 Chatbot assistant ("ChefBot") to ask follow-up cooking questions
- 🌐 Clean and responsive TailwindCSS UI

## 🚀 Live Demo
Coming soon (after Netlify deployment)

## 🛠️ Tech Stack
- React (with Vite)
- TailwindCSS
- Cohere API

## 📦 Setup Instructions

1. **Clone the repo:**
```bash
git clone https://github.com/yourusername/what-can-i-cook.git
cd what-can-i-cook
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in the root:**
```env
VITE_COHERE_API_KEY=your_cohere_api_key_here
```

4. **Run locally:**
```bash
npm run dev
```

The app should now be running at `http://localhost:5173` ✨

## 🔐 API Key Management
- Keys are stored in a `.env` file (ignored by `.gitignore`)
- For deployment (e.g. Netlify), add your key in the environment variables section

## 📁 Folder Structure
```
src/
├── App.jsx          # Main app component
├── index.css        # Tailwind setup
└── main.jsx         # Entry point
```

## 🧠 AI Prompt Logic
The app dynamically generates prompts based on:
- The user's ingredient input
- Meal type (optional)
- Whether it's a new or alternative recipe request
- Follow-up questions sent to ChefBot include the recipe context

## 🤝 Contributing
Pull requests and forks are welcome!

## 📄 License
MIT

---

> Built with ❤️ and curiosity to make cooking easier for everyone.

