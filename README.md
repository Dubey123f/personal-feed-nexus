# Personalized Content Dashboard – SDE Intern Assignment

This project is a **Personalized Content Dashboard** that allows users to view and interact with a curated content feed including news, media recommendations, and social posts. It features an intuitive and responsive UI, state management with Redux Toolkit, and seamless integration with third-party APIs.

## 🔧 Tech Stack
- **React.js + Next.js**
- **TypeScript**
- **Redux Toolkit + RTK Query**
- **Tailwind CSS**
- **Framer Motion / React DnD**
- **Jest / React Testing Library / Cypress**

## 📦 Features

### 📰 Personalized Content Feed
- Configure favorite categories (technology, sports, finance).
- News from NewsAPI, movie/music recommendations from TMDB/Spotify, mock social media posts.
- Interactive content cards with infinite scroll/pagination.

### 🧩 User Dashboard Layout
- Sidebar + Header with search and settings.
- Sections: Feed, Trending, Favorites.

### 🔍 Search Functionality
- Search content across all sources.
- Debounced input for performance.

### 🌙 Advanced UI/UX
- Drag-and-drop content reordering.
- Dark mode toggle.
- Framer Motion animations.

### 🧠 State Management
- Redux Toolkit for global state.
- Async fetching with RTK Query.
- User preferences stored in localStorage or Redux Persist.

### 🧪 Testing
- Unit tests for components.
- Integration tests for rendering + API handling.
- E2E testing with Cypress (search, drag-drop, etc.).

## 🚀 Bonus (Optional)
- 🔐 Auth with NextAuth.js or mock login.
- 🔁 Real-time data via WebSocket or SSE.
- 🌍 Multi-language support via `react-i18next`.

## 📂 Getting Started

### 1. Clone Repo
```bash
git clone https://github.com/Dubey123f/personal-feed-nexus.git
cd personal-feed-nexus
