import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import * as fs from 'fs';
import * as path from 'path';

function createHeading1(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
  });
}

function createHeading2(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}

function createHeading3(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
  });
}

function createBodyParagraph(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 120, line: 276 },
  });
}

function createBullet(title: string, description: string) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [
      new TextRun({ text: title + ': ', bold: true, size: 22 }),
      new TextRun({ text: description, size: 22 }),
    ],
    spacing: { after: 80, line: 260 },
  });
}

function createCallout(label: string, text: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `[${label}] `, bold: true, color: '1A56DB', size: 22 }),
      new TextRun({ text, italics: true, size: 22 }),
    ],
    spacing: { before: 120, after: 140 },
  });
}

const doc = new Document({
  title: 'Full-Stack Software Engineering & Applied AI Mentorship Guide',
  description: 'Living curriculum notes and architectural concepts',
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Full-Stack Software Engineering & Applied AI',
              bold: true,
              size: 44,
              color: '1E3A8A',
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Personal Mentorship Curriculum & Living Study Guide',
              size: 26,
              color: '4B5563',
            }),
          ],
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Last Updated: ', bold: true, size: 20 }),
            new TextRun({ text: new Date().toLocaleDateString(), size: 20 }),
          ],
          spacing: { after: 360 },
        }),

        createHeading1('Module 1: High-Level Full-Stack Architecture'),
        createBodyParagraph(
          'Modern web applications are built on the Client-Server model. Understanding the distinction between what executes on the client versus the server is the single most important architectural foundation in web engineering.'
        ),
        createBullet(
          'The Client (Frontend / Browser)',
          'Executes inside the end-user\'s browser using HTML, CSS, JavaScript, and libraries like React. Its primary duties are presentation, rendering interactive UI elements, and capturing user actions.'
        ),
        createBullet(
          'The Server (Backend / Node.js + Express)',
          'Executes in a protected server environment. Its primary duties are enforcing business rules, validating data, securing credentials, and managing database connections.'
        ),
        createBullet(
          'The Untrusted vs. Trusted Zone Principle',
          'The browser is an UNTRUSTED environment. Anyone can open Chrome DevTools, inspect network traffic, read JavaScript source files, and manipulate client state. Therefore, API keys, database credentials, and business authorization MUST live in the TRUSTED server environment.'
        ),

        createHeading1('Module 2: Communication Protocols & RESTful APIs'),
        createBodyParagraph(
          'The frontend and backend communicate over HTTP (HyperText Transfer Protocol) using structured JSON (JavaScript Object Notation) payloads.'
        ),
        createHeading2('Standard HTTP Methods (CRUD Mapping)'),
        createBullet('GET (Read)', 'Retrieves data from the server. Should be safe and idempotent (making multiple GET requests does not change server state).'),
        createBullet('POST (Create)', 'Submits new data to the server to create a resource. Usually returns HTTP 201 Created.'),
        createBullet('PUT / PATCH (Update)', 'Modifies an existing resource. PUT replaces or completely updates; PATCH applies partial modifications.'),
        createBullet('DELETE (Delete)', 'Removes a specific resource identified by its unique ID.'),

        createHeading2('Standard HTTP Status Codes'),
        createBullet('200 OK', 'The request succeeded and the requested data is returned.'),
        createBullet('201 Created', 'The resource was successfully created (standard for POST).'),
        createBullet('400 Bad Request', 'The client sent invalid data (e.g., missing required fields, wrong data types).'),
        createBullet('404 Not Found', 'The requested resource ID does not exist on the server.'),
        createBullet('500 Internal Server Error', 'An unexpected error occurred on the server while processing the request.'),

        createHeading1('Module 3: Project Setup & Engineering Tooling'),
        createBodyParagraph(
          'A professional project setup ensures security, type safety, and painless local development.'
        ),
        createBullet('Node.js', 'A JavaScript runtime that allows JavaScript code to run outside of the browser on our server machine.'),
        createBullet('Express.js', 'A minimalist web framework providing routing mechanisms and middleware handling on top of Node.js.'),
        createBullet('TypeScript', 'A statically typed superset of JavaScript. It detects type mismatches and spelling errors during development before code is ever run in production.'),
        createBullet('Environment Variables (.env)', 'Keeps environment-specific values (like PORT=5000 or database passwords) outside of code. Loaded at startup with the dotenv package.'),
        createBullet('.gitignore', 'Prevents massive dependency folders (node_modules), compiled code (dist), and private secret files (.env) from being committed to Git.'),

        createHeading1('Module 4: Express Server Pipeline & Middleware'),
        createBodyParagraph(
          'In Express, incoming HTTP requests travel through an assembly-line pipeline called "Middleware" before they hit the final route handler.'
        ),
        createBullet(
          'CORS (Cross-Origin Resource Sharing)',
          'A browser security feature. Browsers block scripts running on origin A (e.g., localhost:5173 React) from reading data from origin B (e.g., localhost:5000 Express). Enabling CORS middleware authorizes our frontend to communicate with our backend.'
        ),
        createBullet(
          'express.json() Body Parser',
          'HTTP transfers payloads as raw binary byte streams. The express.json() middleware intercepts the incoming stream, parses it into a JavaScript object, and attaches it to req.body.'
        ),

        createHeading1('Module 5: The 3-Tier Layered Backend Architecture'),
        createBodyParagraph(
          'To keep code clean, scalable, and maintainable, production backends separate concerns into distinct layers rather than putting all logic into one massive file.'
        ),
        createBullet('1. Types & DTOs (Data Transfer Objects)', 'Defines the contracts and data models (e.g., Task, CreateTaskDTO, UpdateTaskDTO) so every part of the codebase agrees on what fields exist.'),
        createBullet('2. Routes (Traffic Director)', 'Maps URL endpoints and HTTP verbs to the responsible controller functions (e.g., router.get("/", taskController.getAll)).'),
        createBullet('3. Controllers (The Gatekeepers)', 'Handles HTTP-specific logic: parses URL parameters (req.params), validates user input (req.body), calls the appropriate service, and returns proper HTTP status codes.'),
        createBullet('4. Services (The Core Business Logic)', 'Performs pure data operations (querying, updating, calculating). Services know nothing about HTTP or Express, which means they can be reused across Web APIs, background cron jobs, or command-line scripts!'),

        createHeading1('Module 6: Automated API Testing & Architecture Refactoring'),
        createBodyParagraph(
          'A major industry best practice is decoupling the Express application configuration from network port listening:'
        ),
        createBullet(
          'src/app.ts (Application Definition)',
          'Configures middleware, routes, and error handling with NO network side-effects. This allows automated test runners to test the API directly without port conflicts.'
        ),
        createBullet(
          'src/index.ts (Application Runner)',
          'Loads environment variables and binds the app to a specific network port (app.listen(PORT)).'
        ),
        createBullet(
          'Ephemeral Ports (Port 0)',
          'When running automated tests, binding to port 0 tells the operating system to dynamically assign any available port. This ensures tests never fail due to "Port Already In Use" collisions.'
        ),
        createBullet(
          'Automated Test Results',
          'Our test suite (npm run test:api) executed 7 automated assertions covering GET, POST, validation rejection (400), PUT updates, DELETE, and 404 confirmation, achieving a 100% pass rate.'
        ),

        createHeading1('Module 7: Data Persistence, SQL Schemas & SQL Injection Defense'),
        createBodyParagraph(
          'In-memory arrays in RAM lose all data when a server restarts. Real-world applications require durable persistence on non-volatile disk storage.'
        ),
        createBullet(
          'Why SQLite?',
          'Zero-configuration, embedded inside the process, zero external server processes to manage, and full ACID compliance (Atomicity, Consistency, Isolation, Durability).'
        ),
        createBullet(
          'Schema & Engine Constraints',
          'We use PRIMARY KEY for unique indexing and fast lookups, NOT NULL to prevent missing fields, and CHECK(status IN (...)) to enforce valid values directly in the database engine.'
        ),
        createBullet(
          'SQL Injection Prevention',
          'Never concatenate user strings into queries. We use prepared statements (db.prepare(...).run(?, ?)) which separate SQL commands from data values, rendering SQL injection impossible.'
        ),
        createBullet(
          'Architectural Validation',
          'Replacing our in-memory data store with SQLite in taskService.ts required ZERO changes to taskController.ts or taskRoutes.ts, validating our 3-tier separation of concerns.'
        ),

        createHeading1('Module 8: React Fundamentals & Frontend Architecture'),
        createBodyParagraph(
          'React is a declarative, component-based library for building interactive user interfaces.'
        ),
        createBullet(
          'Declarative vs Imperative UI',
          'Imperative programming explicitly alters the DOM element-by-element (jQuery style). Declarative React describes the UI as a function of state (UI = f(state)). React handles all efficient DOM updates automatically.'
        ),
        createBullet(
          'Component Hierarchy',
          'Applications are structured as a tree: App -> Header / KanbanBoard -> KanbanColumn -> TaskCard / TaskModal. Data flows down via props; events flow up via callbacks.'
        ),
        createBullet(
          'State (useState) vs Props',
          'State is private mutable memory inside a component that triggers re-renders when updated. Props are read-only inputs passed from parent components.'
        ),
        createBullet(
          'Side Effects (useEffect)',
          'Used to synchronize React with external systems (like fetching tasks from our Express REST API when the board loads).'
        ),
        createBullet(
          'Vite Dev Proxy',
          'Configured in vite.config.ts to route /api requests to localhost:5000, eliminating CORS issues and hardcoded URLs in frontend development.'
        ),

        createHeading1('Module 9: UI State Synchronization, Callback Props & Optimistic Updates'),
        createBodyParagraph(
          'Connecting UI components to server state requires understanding unidirectional data flow and perceived performance.'
        ),
        createBullet(
          'Callback Functions as Action Triggers',
          'Data flows down via props; events flow up via callbacks. The parent (App.tsx) passes a function like onDelete={handleDeleteTask} down to the child (TaskCard.tsx), which invokes it when clicked.'
        ),
        createBullet(
          'Optimistic UI Updates',
          'Pessimistic UI waits for the network response before changing the screen, feeling sluggish. Optimistic UI updates local state instantly, providing immediate tactile responsiveness, and only rolls back if the network request fails.'
        ),
        createBullet(
          'Type-Only Imports (import type)',
          'With TypeScript 5+ verbatimModuleSyntax, type-only imports ensure zero runtime bundle bloat by stripping compile-time contracts from final JavaScript.'
        ),

        createHeading1('Module 10: Linear Design System, Mobile PWA & Micro-Interactions'),
        createBodyParagraph(
          'Crafting a professional-grade web application requires balancing high desktop data density with responsive mobile ergonomics.'
        ),
        createBullet(
          'Linear Aesthetic Tokens',
          'Ultra-deep canvas (#08090a), crisp borders, monospace item identifiers (TSK-A1B2), and glowing indigo accents (#5e6ad2).'
        ),
        createBullet(
          'Progressive Web App (PWA)',
          'Configured manifest.json with standalone display mode, safe-area viewport insets, and matching theme color so the web-app installs cleanly to the phone home screen without browser bars.'
        ),
        createBullet(
          'Mobile Segmented Tab Navigation',
          'On screens below 820px, the multi-column board automatically transforms into an ergonomic single-column focus layout with top pill tabs and live counts for one-handed thumb interaction.'
        ),
        createBullet(
          'Native HTML5 Drag-and-Drop',
          'Implemented native draggable cards and drop-target zones with glowing visual feedback (column-drag-over) on desktop without heavy third-party libraries.'
        ),
        createBullet(
          'Productivity Shortcuts & Real-Time Filtering',
          'Instant client-side search by title or description, priority pills, and keyboard shortcuts (/ to search, N to add task).'
        ),

        createHeading1('Module 11: Unified Modal Architecture & Full CRUD Lifecycle'),
        createBodyParagraph(
          'Completing the full CRUD contract with clean, reusable components and device-adaptive triggers.'
        ),
        createBullet(
          'Unified Modal Pattern',
          'Instead of duplicating modal markup, a single TaskModal adapts based on editingTask state (blank for create, prepopulated for edit), calling POST or PUT accordingly.'
        ),
        createBullet(
          'Event Propagation & Ergonomics',
          'Single-clicking a card body or the footer pencil icon opens the edit modal, while move arrows call e.stopPropagation() so quick moves never accidentally pop open the modal.'
        ),
        createBullet(
          'Mobile Drawer Integration',
          'On smartphones, tapping a card opens the slide-up Action Drawer with a dedicated "Edit Task Details" button leading into the modal.'
        ),

        createHeading1('Module 12: Serverless Deployment (Vercel) & Cloud Database (Supabase)'),
        createBodyParagraph(
          'Deploying to modern edge networks with serverless architectures and hosted cloud databases.'
        ),
        createBullet(
          'Serverless vs Persistent Servers',
          'Vercel uses ephemeral serverless functions where local disk is wiped on shutdown. This requires migrating from local SQLite files to a hosted cloud database like Supabase PostgreSQL.'
        ),
        createBullet(
          'Hybrid Database Adapter Pattern',
          'taskService.ts automatically checks if Supabase credentials exist. In production it queries cloud PostgreSQL; in offline local testing it uses embedded SQLite, giving the best of both worlds.'
        ),
        createBullet(
          'Vercel Monorepo Serverless Routing',
          'api/index.ts exports our Express app as a serverless function, and vercel.json rewrites /api/(.*) to it while serving the static React build from client/dist.'
        ),

        createHeading1('Current Project: Kanban Task Management Dashboard'),
        createBodyParagraph('We have completed all development phases of Project #1:'),
        createBullet('Phase 1A: Backend REST API', 'Scaffold Node/Express/TypeScript, define Task data model, and implement CRUD endpoints. [Status: Completed & 100% Tested]'),
        createBullet('Phase 1B: Data Persistence', 'Integrated SQLite schema with prepared statements and constraints. Verified with automated tests. [Status: Completed & 100% Tested]'),
        createBullet('Phase 1C: Frontend Client', 'Built modular UI (Header, KanbanBoard, KanbanColumn, TaskCard, TaskModal) with clean dark-mode CSS and optimistic updates. [Status: Completed]'),
        createBullet('Phase 1D: Full-Stack Integration', 'Connected React to Express API via Vite proxy with loading states, error boundaries, and optimistic status updates. [Status: Completed]'),
        createBullet('Phase 1E: Linear UI/UX & Mobile PWA', 'Linear design system, HTML5 drag-and-drop, mobile segmented tab navigation, bottom sheet drawer, keyboard shortcuts, and PWA installability. [Status: Completed]'),
        createBullet('Phase 1F: Full Task Editing', 'Unified modal for Create & Edit, card click triggers, dedicated pencil buttons, and optimistic state synchronization. [Status: Completed]'),
        createBullet('Phase 1G: Serverless & Cloud Database', 'Integrated Cloud Supabase PostgreSQL with local SQLite fallback, and configured Vercel serverless routing. [Status: Completed]'),

        createCallout(
          'HOW TO USE THIS DOCUMENT',
          'You can upload this .docx file directly to Google Drive/Google Docs anytime to read on your computer, tablet, or phone. We will continually update this file with new modules as our mentorship progresses.'
        ),
      ],
    },
  ],
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('..', 'FullStack_Mentorship_Guide.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document successfully written to: ${outputPath}`);
}

main().catch(console.error);
