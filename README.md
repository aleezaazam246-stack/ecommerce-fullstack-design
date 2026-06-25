# 🛍️ Ecommerce Full-Stack Application

A complete ecommerce website built with React, Node.js, Express, and TailwindCSS.

## Features
- 🏠 Home Page with featured products
- 📦 Product Listing with search and filter
- 🔍 Product Details page
- 🛒 Shopping Cart (localStorage)
- 👑 Admin Panel (CRUD operations)
- 🤖 AI Shopping Assistant (Gemini API)
- 📱 Fully Responsive Design

## Tech Stack
- **Frontend:** React, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** JSON Server (file-based)
- **AI:** Google Gemini API

## Run Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Backend Setup
```bash
# Install dependencies
npm install

# Create .env file and add GEMINI_API_KEY
echo GEMINI_API_KEY=your_api_key > .env.local

# Start backend server
npm run dev
