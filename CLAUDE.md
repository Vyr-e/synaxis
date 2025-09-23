PROJECT CONTEXT & PHILOSOPHY
Core Mission: Build scalable systems, ship meaningful software, eventually run a tech company.
Development Approach:

  * Build fast, functional apps and systems (mostly solo)
  * Clean, SOLID code with small reusable functions
  * Good variable naming and lean architecture
  * Break projects into tasks, think in systems
  * Prioritize DX and maintainability
  * Push ideas 60–70%, prototype the next, polish later if dope

Tech Stack:

  * Go: Scalable, concurrent systems and CLI tools
  * TypeScript + Next.js: Fullstack web apps (Tailwind, tRPC, shadcn/ui)
  * Elixir: Fault-tolerant systems and workflows (WIP)
  * Python: ML, RL, and data pipelines
  * Rust: Exploratory toy projects only
  * React Native: Mobile development

BUILD & DEVELOPMENT COMMANDS

  * Install Dependencies: `bun install`
  * Run Development Server: `bun run dev`
  * Run Linting: `bun run lint`
  * Run Tests: `bun test`
  * Build for Production: `bun run build`

MUST attempt programmatic checks (linting, tests) and fix failures before finishing tasks.

GO-SPECIFIC PATTERNS
MUST prioritize `sqlc` for all Go projects involving databases:

  * Type Safety: Generate type-safe Go code from SQL queries
  * Performance: Raw SQL performance without ORM overhead
  * Maintainability: Keep SQL in `.sql` files, separate from Go code
  * Structure: Follow repository pattern with `sqlc`-generated code

Go Project Structure Pattern:

```
project/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── api/
│   ├── domain/
│   └── repository/
├── db/
│   ├── migrations/
│   ├── queries/
│   └── sqlc/
├── sqlc.yaml
└── go.mod
```

MUST use focused package names reflecting purpose, not content type.
MUST follow dependency inversion with interfaces.
SHOULD use domain-driven design for larger applications.

NEXT.JS ARCHITECTURE: MANDATORY RULES

1.  Rendering Strategy Hierarchy
      * Server Components are Default: All components server-side unless client interactivity required
      * Client Components are Exceptions: Use `'use client'` only for state, effects, or browser APIs
      * Push Client Components Down: Minimize client-side bundle size
2.  Data Fetching Strategies
      * Static First (SSG): Pre-rendered pages when possible
      * ISR: Static pages with periodic updates
      * Dynamic Rendering (SSR): Personalized/real-time data
      * Client-Side: TanStack Query for complex client-side data management
3.  Mutations & Forms: Server Actions Paradigm
    MUST use Server Actions for all data mutations:
      * `useOptimistic`: Update UI immediately before server response
      * `useTransition`: Wrap Server Actions in `startTransition`
      * `useActionState`: Handle server-side validation/success
      * `useFormStatus`: Form submission feedback
4.  Performance Requirements
      * `next/font`: MANDATORY for all fonts (eliminate CLS)
      * `next/image`: FORBIDDEN to use `<img>` tag
      * `next/script`: All third-party scripts via `<Script>`
      * `next/dynamic`: Code-split large client components

UNIVERSAL INTERFACE GUIDELINES
Interactions

  * MUST: Full keyboard support per WAI-ARIA APG
  * MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  * MUST: Hit target ≥24px (mobile ≥44px) - expand if visual \<24px
  * MUST: Mobile `<input>` font-size ≥16px to prevent iOS zoom
  * NEVER: Disable browser zoom
  * MUST: Hydration-safe inputs (no lost focus/value)
  * NEVER: Block paste in inputs
  * MUST: Loading buttons show spinner + keep original label
  * MUST: Enter submits focused text input; ⌘/Ctrl+Enter in `<textarea>`
  * MUST: URL reflects state (deep-link filters/tabs/pagination)
  * MUST: Links are links—use `<a>`/`<Link>` for navigation

Animation

  * MUST: Honor `prefers-reduced-motion`
  * SHOULD: CSS \> Web Animations API \> JS libraries
  * MUST: Animate compositor-friendly props (transform, opacity)
  * MUST: Animations interruptible and input-driven
  * MUST: Correct `transform-origin`

Content & Accessibility

  * MUST: Skeletons mirror final content (avoid layout shift)
  * MUST: `<title>` matches current context
  * MUST: No dead ends—always offer next step/recovery
  * MUST: Design all states: empty/sparse/dense/error
  * MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums`)
  * MUST: Redundant status cues (not color-only)
  * MUST: Icon-only buttons have descriptive `aria-label`
  * MUST: Prefer native semantics before ARIA

Performance

  * MUST: Track and minimize re-renders
  * MUST: Profile with CPU/network throttling
  * MUST: Mutations (POST/PATCH/DELETE) target \<500ms
  * MUST: Virtualize large lists
  * MUST: Prevent CLS from images
  * SHOULD: Test iOS Low Power Mode and macOS Safari

DESIGN STANDARDS

  * SHOULD: Layered shadows (ambient + direct)
  * SHOULD: Crisp edges via semi-transparent borders + shadows
  * SHOULD: Nested radii: child ≤ parent; concentric
  * MUST: Accessible charts (color-blind-friendly palettes)
  * MUST: Meet contrast requirements
  * MUST: Increase contrast on `:hover`/`:active`/`:focus`

COPYWRITING GUIDELINES

  * Voice: Active, second-person, clear and concise
  * Headings & buttons: Title Case
  * Actions: Instead of "Continue," use "Save API Key"
  * Errors: Tell users how to fix it: "Your API key is incorrect. Generate a new key in Account Settings."
  * Numbers: Use numerals for counts ("8 deployments")
  * Currency: Consistent decimal places in context
  * Spacing: "10 MB" not "10MB"

INTERACTION GUIDELINES

  * MUST: Default to a direct, professional, and technically-focused tone.
  * MUST: Ask clarifying questions to understand the core problem before offering a solution, especially for debugging tasks.
  * MUST: Justify architectural suggestions and code modifications by referencing principles from this document (e.g., SOLID, DX, performance, specific stack patterns).
  * MUST: Proactively identify potential edge cases, future maintenance concerns, or alternative approaches related to the user's query.
  * SHOULD: Frame responses to guide the user toward a solution rather than just providing the final answer, fostering independent problem-solving.
  * MUST: Generate code that strictly adheres to the Go and Next.js patterns defined herein, including structure, tooling (`sqlc`), and performance requirements.
  * NEVER: Apologize for challenging an idea; frame challenges constructively around technical trade-offs and project goals.
  * MUST: Adapt the depth of explanation to the context. Provide high-level summaries for architectural questions and detailed, step-by-step guidance for implementation or debugging.