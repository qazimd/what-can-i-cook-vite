# 🍳 What Can I Cook?

A simple yet smart recipe suggestion app that takes your available ingredients and suggests step-by-step recipes powered by **Cohere AI**.

Built with **React**, **Vite**, and styled using **TailwindCSS**. Easily deployable to Netlify.

---

## 🚀 Features

- ✅ Enter ingredients to get 2–3 unique dish suggestions
- 🍽️ Choose meal type: **Breakfast**, **Lunch**, **Dinner**, or **Any**
- 🔁 Get completely different suggestions with a single click
- 💬 Ask follow-up questions about the recipes via a built-in chatbox
- 🧠 AI-powered responses from Cohere
- 💾 Remembers last 5 ingredient sets (only for current session)

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **AI API:** Cohere Generate (Text Generation)
- **Hosting:** Netlify (Frontend Only)

---

## 📁 Folder Structure

```
what-can-i-cook/
├── public/
├── src/
│   └── App.jsx
├── .env
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/what-can-i-cook.git
cd what-can-i-cook
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Your API Key
Create a `.env` file in the root of the project:
```bash
VITE_COHERE_API_KEY=your_cohere_api_key_here
```

> ⚠️ The `VITE_` prefix is required for Vite to expose it to the frontend.

### 4. Start the Development Server
```bash
npm run dev
```

Your app should now be live at `http://localhost:5173`

---

## 🌐 Deployment (Netlify)

1. Push your project to GitHub
2. Connect your GitHub repo to [Netlify](https://app.netlify.com/)
3. Set environment variable `VITE_COHERE_API_KEY` in **Netlify → Site Settings → Environment Variables**
4. Set build command to `npm run build`
5. Set publish directory to `dist`
6. Deploy!

---

## 🧠 Demo Prompts

### English
```
eggs, tomato, cheese
bread, avocado, feta cheese, lemon
```

---

## 🔐 Security Note

The API key is exposed in the frontend in this setup.
To secure it, move API calls to a backend (e.g., Express or Netlify functions).
