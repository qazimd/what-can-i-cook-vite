# 🍳 What Can I Cook?

**A smart recipe suggestion app** that takes your available ingredients and meal type, then uses AI to suggest step-by-step recipes. Built with **React + Vite** and powered by **Cohere AI** via an **Express backend**.

---

## 🚀 Features

- ✅ Input ingredients and get 2–3 recipe suggestions with steps
- 🍽️ Meal type selector: breakfast, lunch, dinner, or any
- 🔁 Alternative recipe suggestions
- 💬 Chatbox to ask follow-up questions about recipes
- 🧠 Smart prompt generation with conversational context
- 💾 Recent inputs (stored per session)

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TailwindCSS
- **Backend:** Express.js
- **AI API:** Cohere (text generation)

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/what-can-i-cook.git
cd what-can-i-cook
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the **root** of your project:
```env
COHERE_API_KEY=your_actual_api_key_here
```

### 4. Start the App (Frontend + Backend)
Use this to start both React and Express servers at once:
```bash
npm run dev
```

> Make sure `nodemon` is installed globally if you get a `nodemon not found` error:
```bash
npm install -g nodemon
```

---

## 📁 Folder Structure
```plaintext
what-can-i-cook/
├── public/
├── src/
│   └── App.jsx
├── server/
│   └── index.js        ← Express backend
├── .env                ← API key goes here 
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔐 API Security

- Your **API key is hidden** using a backend Express server
- The server implements **basic rate limiting**: max 6 requests per IP per minute

---

## ✅ Deployment Options

### Local
- Run: `npm run dev`
- Access app on `http://localhost:5173`

---

## 🧠 Demo Prompts

### English:
```txt
bread, avocado, feta cheese, lemon
eggs, tomato, cheese
```

### Follow-Up:
```txt
Can I replace feta with cheddar?
What sides go best with the second recipe?
```


