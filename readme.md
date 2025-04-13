# 🍳 What Can I Cook?

A simple AI-powered web app built with React + Vite that helps users discover recipes based on the ingredients they already have at home.

## 🔍 Features

- 🧠 Uses Cohere's AI model to generate step-by-step recipes
- 🕹️ Meal type selector: Breakfast, Lunch, Dinner, or Any
- 📌 Recent input history (last 5 entries stored per session)
- 💬 Chatbot assistant ("ChefBot") to ask follow-up cooking questions
- 🌐 Clean and responsive TailwindCSS UI
- 🔒 Secure backend using Netlify Functions with basic rate limiting

## 🚀 Live Demo
Coming soon (after Netlify deployment)

## 🛠️ Tech Stack
- React (with Vite)
- TailwindCSS
- Netlify Functions
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
COHERE_API_KEY=your_cohere_api_key_here
```

4. **Run locally with Netlify Dev:**
```bash
npm install -g netlify-cli
netlify dev
```

The app should now be running at `http://localhost:8888` ✨

## 🔐 API Key Management
- API calls are made securely through Netlify Functions
- Keys are stored in `.env` (and excluded from Git)
- For deployment (e.g. Netlify), add your key in the **Environment Variables** section of the site settings

## 🧱 Folder Structure
```
/netlify/functions/   # Serverless functions (e.g. getRecipe.js)
/src/                 # React App
  ├── App.jsx         # Main app logic
  └── index.css       # Tailwind setup
.env                  # Local environment variables
```

## 🚧 Rate Limiting
To protect API usage, each IP address is limited to **5 requests per minute** via in-memory tracking inside the Netlify Function.

## 💡 Prompt Logic
- Includes selected meal type in the prompt
- Adapts based on whether it's an alternative request
- Follow-up questions to ChefBot include recipe context

## 🤝 Contributing
Pull requests and forks are welcome! To contribute:
- Fork the repo
- Create a branch
- Make changes
- Open a PR for review

## 👀 Visibility & Permissions
This is a **public repository**:
- ✅ Anyone can **view or clone** the code
- ❌ Only **collaborators can push** or merge changes

If you'd like to contribute, please open a pull request.

## 📄 License
MIT

---

> Built with ❤️ and curiosity to make cooking easier for everyone.
