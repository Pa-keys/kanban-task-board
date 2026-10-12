# 📋 Kanban Task Board

A high-performance, full-stack Kanban task management web application inspired by Linear's design system. Built with **React 18**, **TypeScript**, **Node.js**, **Express**, and **SQLite**, with full **Progressive Web App (PWA)** mobile capabilities.

---

## ✨ Features

- **Linear-Inspired UI/UX:** Deep dark-mode aesthetic (`#08090a`), glowing indigo accents (`#5e6ad2`), monospace task tags (`TSK-A1B2`), and fluid micro-interactions.
- **Desktop Drag & Drop:** Native HTML5 draggable task cards with live drop-target column highlights.
- **Mobile PWA (Web-App):**
  - **Segmented Tab Navigation:** Replaces wide multi-column layout with single-column focus tabs on mobile screens for effortless one-handed thumb interaction.
  - **Installable Home Screen App:** Standalone display mode (zero browser URL bars) and custom theme color.
  - **Mobile Action Drawer:** Touch bottom sheet for rapid status switching and deletions.
- **Real-Time Search & Priority Filtering:** Client-side instant keyword search and priority pills (High, Medium, Low).
- **Keyboard-First Workflow:** Press `/` to focus search, `N` to create a task, and `Esc` to close modals.
- **Resilient Backend & Data Persistence:**
  - RESTful API with layered 3-tier architecture (Types $\rightarrow$ Routes $\rightarrow$ Controllers $\rightarrow$ Services).
  - SQLite database persistence with prepared statements guarding against SQL injection.
  - 100% automated test suite (`npm run test:api`).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, CSS Modules / Custom Properties
- **Backend:** Node.js (v24), Express 5, TypeScript, SQLite (`node:sqlite`)
- **Testing & Tooling:** Automated REST integration tests with ephemeral ports, `docx` study guide generator

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation
Clone this repository and install dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/kanban-task-board.git
cd kanban-task-board

# Install server & client dependencies
cd server && npm install
cd ../client && npm install
cd ..
```

### Running Locally

1. **Start the Backend Server (Terminal 1):**
   ```bash
   npm run server
   ```
   *Runs on `http://localhost:5000`*

2. **Start the Frontend Client (Terminal 2):**
   ```bash
   npm run client
   ```
   *Runs on `http://localhost:3000` (Local) and `http://192.168.x.x:3000` (Network)*

3. **Run Automated Tests:**
   ```bash
   npm run test:api
   ```

4. **Recompile Study Guide Document:**
   ```bash
   npm run generate-doc
   ```

---

## 📚 Mentorship Study Guide
For detailed notes on architecture decisions, security patterns, and full-stack fundamentals, see [`STUDY_GUIDE.md`](./STUDY_GUIDE.md) or open `FullStack_Mentorship_Guide.docx` in Google Docs.
