# Full-Stack Software Engineering & Applied AI Mentorship Guide
*A living reference guide of core concepts, system architecture, and best practices.*

---

## Module 1: High-Level Full-Stack Architecture
Modern web applications are built on the **Client-Server model**. Understanding the distinction between what executes on the client versus the server is the single most important architectural foundation in web engineering.

* **The Client (Frontend / Browser):** Executes inside the end-user's browser using HTML, CSS, JavaScript, and libraries like React. Its primary duties are presentation, rendering interactive UI elements, and capturing user actions.
* **The Server (Backend / Node.js + Express):** Executes in a protected server environment. Its primary duties are enforcing business rules, validating data, securing credentials, and managing database connections.
* **The Untrusted vs. Trusted Zone Principle:** The browser is an **UNTRUSTED** environment. Anyone can open Chrome DevTools, inspect network traffic, read JavaScript source files, and manipulate client state. Therefore, API keys, database credentials, and business authorization MUST live in the **TRUSTED** server environment.

---

## Module 2: Communication Protocols & RESTful APIs
The frontend and backend communicate over **HTTP (HyperText Transfer Protocol)** using structured **JSON (JavaScript Object Notation)** payloads.

### Standard HTTP Methods (CRUD Mapping)
* **GET (Read):** Retrieves data from the server. Should be safe and idempotent (making multiple GET requests does not change server state).
* **POST (Create):** Submits new data to the server to create a resource. Usually returns HTTP `201 Created`.
* **PUT / PATCH (Update):** Modifies an existing resource. `PUT` replaces or completely updates; `PATCH` applies partial modifications.
* **DELETE (Delete):** Removes a specific resource identified by its unique ID.

### Standard HTTP Status Codes
* **200 OK:** The request succeeded and the requested data is returned.
* **201 Created:** The resource was successfully created (standard response for POST).
* **400 Bad Request:** The client sent invalid data (e.g., missing required fields, wrong data types).
* **404 Not Found:** The requested resource ID does not exist on the server.
* **500 Internal Server Error:** An unexpected error occurred on the server while processing the request.

---

## Module 3: Project Setup & Engineering Tooling
* **Node.js:** A JavaScript runtime that allows JavaScript code to run outside of the browser on our server machine.
* **Express.js:** A minimalist web framework providing routing mechanisms and middleware handling on top of Node.js.
* **TypeScript:** A statically typed superset of JavaScript. It detects type mismatches and spelling errors during development before code is ever run in production.
* **Environment Variables (`.env`):** Keeps environment-specific values (like `PORT=5000` or database passwords) outside of code. Loaded at startup with the `dotenv` package.
* **`.gitignore`:** Prevents massive dependency folders (`node_modules`), compiled code (`dist`), and private secret files (`.env`) from being committed to Git.

---

## Module 4: Express Server Pipeline & Middleware
In Express, incoming HTTP requests travel through an assembly-line pipeline called **Middleware** before they hit the final route handler.

* **CORS (Cross-Origin Resource Sharing):** A browser security feature. Browsers block scripts running on origin A (e.g., `localhost:5173` React) from reading data from origin B (e.g., `localhost:5000` Express). Enabling CORS middleware authorizes our frontend to communicate with our backend.
* **`express.json()` Body Parser:** HTTP transfers payloads as raw binary byte streams. The `express.json()` middleware intercepts the incoming stream, parses it into a JavaScript object, and attaches it to `req.body`.

---

## Module 5: The 3-Tier Layered Backend Architecture
To keep code clean, scalable, and maintainable, production backends separate concerns into distinct layers rather than putting all logic into one massive file:

```
server/src/
 ├── types/           -> 1. Types & DTOs (Data contracts)
 ├── routes/          -> 2. Routes (Traffic director)
 ├── controllers/     -> 3. Controllers (Validation & HTTP responses)
 ├── services/        -> 4. Services (Pure business logic & data operations)
 └── index.ts         -> Entry Point (App wiring & middleware)
```

1. **Types & DTOs (Data Transfer Objects):** Defines the contracts and data models (`Task`, `CreateTaskDTO`, `UpdateTaskDTO`) so every part of the codebase agrees on what fields exist.
2. **Routes (Traffic Director):** Maps URL endpoints and HTTP verbs to the responsible controller functions (e.g., `router.get('/', taskController.getAll)`).
3. **Controllers (The Gatekeepers):** Handles HTTP-specific logic: parses URL parameters (`req.params`), validates user input (`req.body`), calls the appropriate service, and returns proper HTTP status codes.
4. **Services (The Core Business Logic):** Performs pure data operations (querying, updating, calculating). Services know nothing about HTTP or Express, which means they can be reused across Web APIs, background cron jobs, or command-line scripts!

---

## Module 6: Automated API Testing & The `app.ts` vs `index.ts` Pattern
A major industry best practice is decoupling the Express application configuration from network port listening:

* **`src/app.ts` (Application Definition):** Configures middleware, error handlers, and route mounts. It has **no network side-effects** (does not call `listen()`). This allows automated test runners to instantiate the app instantly in memory or on ephemeral ports without port conflicts.
* **`src/index.ts` (Application Runner):** Loads environment variables from `.env` and binds the app to a network port (`app.listen(PORT)`).

### Why Ephemeral Ports (Port 0) Matter for Testing
When running integration tests, binding to a hardcoded port (e.g. `5000`) can fail if another service or developer instance is already running. By listening on port `0`, the operating system dynamically assigns any available, unallocated port for the duration of the test, ensuring 100% collision-free testing.

---

## Module 7: Data Persistence, SQL Schemas & SQL Injection Defense
In volatile in-memory storage (arrays in RAM), all state is lost whenever the process restarts. Real-world applications require durable persistence on non-volatile disk storage.

### Why SQLite?
* **Zero Configuration:** Unlike external database engines (PostgreSQL, MySQL), SQLite is embedded directly into the application process. There is no separate database server process to start, configure, or monitor.
* **Single-File Portability:** The entire database lives in a single file (`kanban.db`), making it ideal for edge apps, local development, and reproducible test suites.
* **Full ACID Compliance:** Guarantees Atomicity, Consistency, Isolation, and Durability.

### Database Constraints as the Last Line of Defense
We defined our SQL schema with strict constraints:
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  priority TEXT NOT NULL CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')),
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```
* **`PRIMARY KEY`**: Enforces record uniqueness and automatically creates a B-tree index for lightning-fast lookups.
* **`NOT NULL`**: Forbids missing data fields at the storage engine level.
* **`CHECK(...)`**: Validates allowed enum values directly in the database engine, ensuring corrupted data cannot enter even if application-level code has a bug.

### Security: SQL Injection Defense via Prepared Statements
Never concatenate raw user input into an SQL string:
* ❌ **Vulnerable:** `db.exec("SELECT * FROM tasks WHERE id = '" + id + "'")` (Attacker could pass `' OR 1=1 --` to extract or delete the whole database).
* ✅ **Secure:** `db.prepare("SELECT * FROM tasks WHERE id = ?").get(id)`
Parameterized queries send the SQL template and user data separately. The database treats the parameter purely as literal data, making SQL injection impossible.

### Real-World Architecture Validation
When we replaced the in-memory array with SQLite in `taskService.ts`:
* `taskController.ts` required **0 changes**.
* `taskRoutes.ts` required **0 changes**.
This proved the power of our **3-Tier Layered Architecture**—swapping the storage implementation did not ripple into or break any other layers!

---

## Module 8: React Fundamentals & Frontend Architecture
React is a declarative, component-based library for building user interfaces.

### 1. Declarative UI vs Imperative UI
* **Imperative (Legacy JS / jQuery):** You explicitly tell the browser *how* to change each DOM element step-by-step (`document.getElementById('task-list').appendChild(newCard)`). This quickly leads to state synchronization bugs.
* **Declarative (React):** You describe *what* the UI should look like for a given state (`UI = f(state)`). Whenever state changes, React computes the diff (via the Virtual DOM) and automatically updates only the necessary elements in the browser DOM.

### 2. Component Hierarchy (The Component Tree)
Every React application is structured as a tree of independent, reusable pieces:
```
App (Top-level state: tasks, loading, error)
 ├── Header (App title, "New Task" trigger button)
 ├── KanbanBoard (Layout container)
 │    ├── KanbanColumn (Column: 'To Do', 'In Progress', or 'Done')
 │    │    └── TaskCard (Renders single card with priority tag & actions)
 └── TaskModal (Form dialog to create or edit a task)
```

### 3. State (`useState`) vs Props
* **State (`useState`):** Private, mutable memory inside a component. When state updates, React re-renders that component and its children.
* **Props (Properties):** Immutable data passed *down* from parent to child. Props flow strictly in one direction (unidirectional data flow).

### 4. Side Effects (`useEffect`)
Pure React components only render UI from props and state. When a component needs to perform a "side effect"—such as fetching tasks from our Express API when the page first loads—we use the `useEffect` hook:
```typescript
useEffect(() => {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(data => setTasks(data.data));
}, []); // Empty array = run once when component mounts
```

### 5. Vite Development Server Proxy
During local development, React runs on port 3000 and Express runs on port 5000. In `vite.config.ts`, we configured a development proxy:
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```
This lets frontend code simply call `/api/tasks` without hardcoding hostnames, completely eliminating CORS friction in development and matching production environments.

---

## Module 9: UI State Synchronization, Callback Props & Optimistic Updates

### 1. Callback Functions as Action Triggers (Child-to-Parent Communication)
In React, state flows downward (Props), but events flow upward (Callbacks).
* The parent (`App.tsx`) holds the master list of tasks and defines `handleDeleteTask(id)`.
* It passes this function down as a prop: `<TaskCard onDelete={handleDeleteTask} />`.
* When the user clicks the delete button in the child, `onDelete(task.id)` executes, firing the trigger in `App.tsx` and updating master state!

### 2. Optimistic UI Updates vs Pessimistic UI Updates
* **Pessimistic UI:** You click "Delete" $\rightarrow$ Wait 300ms for network request $\rightarrow$ UI updates only after the server responds. This feels sluggish.
* **Optimistic UI:** You click "Delete" $\rightarrow$ UI instantly removes the card $\rightarrow$ Background request confirms deletion $\rightarrow$ If the request fails, the UI rolls back and displays an error alert.
In `App.tsx`, we implemented optimistic updates for instant, buttery-smooth interactions:
```typescript
// Instantly update local React state
setTasks((prev) => prev.filter((t) => t.id !== id));
// Persist to server in background
await taskApi.deleteTask(id);
```

### 3. Type-Only Imports (`import type`) & `verbatimModuleSyntax`
In modern TypeScript (v5+) with `verbatimModuleSyntax`, importing types using standard `import { Task }` causes a compiler error. 
Using `import type { Task }` guarantees that the TypeScript compiler completely strips that import from the emitted JavaScript bundle, preventing phantom runtime imports and reducing final bundle size.

---

## Module 10: Linear-Style Design System, PWA Web-App Architecture & Micro-Interactions

### 1. The Linear Aesthetic & Design Tokens
* **Ultra-Crisp Dark Canvas:** Canvas `#08090a`, column surfaces `#0f1115`, card surfaces `#15181e`, with subtle indigo hover glows (`#5e6ad2`).
* **High Data Density:** Monospace task identifiers (e.g. `TSK-A1B2`) paired with color-coded dot badges for priority levels (High, Medium, Low).
* **Keyboard-First Workflow:** Pressing `/` instantly focuses the search bar; pressing `N` opens the task creation modal.

### 2. Mobile Web-App & Progressive Web App (PWA) Architecture
To make the web app feel like a native mobile app on smartphones:
* **Web App Manifest (`manifest.json`):** Configures `display: standalone` (removes browser URL/search bars when launched from the home screen) and `theme_color: #08090a` (tints the phone status bar to match the app).
* **Viewport & Safe Areas:** `viewport-fit=cover` and CSS `env(safe-area-inset-bottom)` ensure modals and action drawers don't collide with the iPhone home bar or Android gesture bar.
* **Sticky Segmented Tab Bar:** Traditional multi-column Kanban boards cause horizontal squishing or awkward side-scrolling on phones. On mobile screens ($<820px$), we transform the board into an ergonomic single-column focus layout with top pill tabs and live item counts, enabling rapid one-thumb navigation.
* **Mobile Bottom Sheet Drawer:** Tapping any card on a mobile screen triggers a slide-up drawer with one-thumb column movement, details, and delete actions.

### 3. Native Desktop Drag-and-Drop
We implemented native HTML5 Drag and Drop without heavy external libraries:
* Cards declare `draggable` and populate `dataTransfer.setData('text/plain', id)` on `dragstart`.
* Columns listen to `onDragOver` (calling `e.preventDefault()` to permit dropping) and update local `isDragOver` state to render glowing drop indicators.
* On `drop`, the column extracts the task ID and triggers `onDropTask(targetStatus)` to persist the column transition.

---

## Module 11: Unified Modal Architecture & Full CRUD Lifecycle

### 1. Dual-Purpose Components (Create vs. Edit)
Instead of writing separate `CreateTaskModal` and `EditTaskModal` components (which duplicates 90% of form validation, inputs, and CSS), industry standard is a single **Unified Modal** driven by state:
* When `editingTask === null`: Modal renders "Create New Task" with blank fields and invokes `POST /api/tasks`.
* When `editingTask !== null`: Modal renders "Edit Task" with prepopulated values (`title`, `description`, `status`, `priority`) and invokes `PUT /api/tasks/:id`.

### 2. Multi-Device Trigger Ergonomics
* **Desktop (>=820px):** Single-click anywhere on the card or clicking the ✏️ pencil icon in the card footer immediately opens the edit modal. Directional move arrows (`←` / `→`) stop event propagation (`e.stopPropagation()`) so quick-moving a card never accidentally triggers the modal.
* **Mobile (<820px):** Tapping a card opens the slide-up Action Drawer, which now includes a dedicated "Edit Task Details" button leading into the modal.

### 3. Full CRUD Loop Complete
Our Kanban board now fulfills the complete database CRUD contract end-to-end:
* **C (Create):** `POST /api/tasks` via "+ New Task" or pressing `N`.
* **R (Read):** `GET /api/tasks` with search and priority filtering.
* **U (Update):** `PUT /api/tasks/:id` via Drag-and-Drop, move arrows, or full Edit Modal.
* **D (Delete):** `DELETE /api/tasks/:id` via card trash button or bottom sheet.

---

## Current Project: Kanban Task Management Dashboard
We have built and completed Project #1 following an API-first approach:
* [x] **Phase 1A: Backend REST API** — Scaffold Node/Express/TypeScript, define Task data model, and implement CRUD endpoints.
* [x] **Phase 1A Testing**: Automated test suite verified 7/7 test cases (Health, Read, Create, Reject invalid, Update, Delete, 404 confirmation).
* [x] **Phase 1B: Data Persistence** — Integrated SQLite schema with prepared statements and constraints. Verified with automated tests.
* [x] **Phase 1C: Frontend Client** — Built modular UI (Header, KanbanBoard, KanbanColumn, TaskCard, TaskModal) with clean dark-mode CSS and optimistic updates.
* [x] **Phase 1D: Full-Stack Integration** — Connected React to Express API via Vite proxy with loading states, error boundaries, and optimistic status updates.
* [x] **Phase 1E: Linear UI/UX & Mobile PWA** — Implemented Linear design system, HTML5 drag-and-drop, mobile segmented tab navigation, bottom sheet drawer, keyboard shortcuts, and PWA installability.
* [x] **Phase 1F: Full Task Editing** — Unified modal for Create & Edit, card click triggers, dedicated pencil buttons, and optimistic state synchronization.
