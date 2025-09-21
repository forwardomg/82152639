# React Comments System

A nested comments system built with React 19, TypeScript, and IndexedDB for persistent storage.

## Features

- **Nested Comments**: Support for nested replies up to 4 levels deep
- **CRUD Operations**: Create, read, update, and delete comments
- **Persistent Storage**: All comments are stored in IndexedDB using Dexie.js
- **Cross-Tab Synchronization**: Comments sync across browser tabs automatically
- **Smart Deletion**: Soft delete for comments with replies, hard delete for leaf comments
- **Relative Timestamps**: Shows "2 hours ago" style timestamps
- **Author Memory**: Remembers your author name for future comments
- **Keyboard Shortcuts**: Submit comments with Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
- **Unsaved Changes Protection**: Browser warning when leaving page with unsaved form data
- **Collapsible Threads**: Collapse/expand comment threads to manage long discussions
- **Error Boundaries**: Graceful error handling with user-friendly messages

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Dexie.js** for IndexedDB management
- **CSS Modules** for component-scoped styling
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **ESLint** for code linting
- **Prettier** for code formatting
- **pnpm** for package management

## Testing

The project uses a hybrid testing approach:

- **Unit tests** with Vitest for utilities and helpers
- **E2E tests** with Playwright for business logic and user flows

Business logic is intentionally covered by E2E tests rather than unit tests to ensure the entire system works correctly from the user's perspective, including React components, state management, and IndexedDB persistence.

**Note**: Test coverage is limited due to time constraints.

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Installation

```bash
# Clone the repository
git clone https://github.com/forwardomg/82152639
cd 82152639

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Running Production Build Locally

```bash
# Build the project
pnpm build

# Navigate to build output
cd dist

# Serve with any static server
npx http-server
```

## Available Scripts

- `pnpm dev` - Start development server (http://localhost:5173)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests in interactive UI mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:e2e` - Run Playwright E2E tests

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   └── comments/
│   │   │       ├── CommentForm/        # Reusable form for new/edit/reply
│   │   │       ├── CommentItem/        # Individual comment with actions
│   │   │       ├── Comments/           # Main comments container
│   │   │       ├── CommentsConnected/  # Data-connected wrapper
│   │   │       └── CommentErrorBoundary/ # Comments error handling
│   │   └── ui/
│   │       ├── Button/          # Reusable button component
│   │       ├── ErrorBoundary/   # Generic error boundary
│   │       ├── FormField/       # Form field wrapper
│   │       ├── Input/           # Input component
│   │       ├── TextArea/        # Textarea component
│   │       └── Title/           # Title component
│   ├── constants/
│   │   ├── storage.ts          # LocalStorage keys
│   │   ├── ui.ts               # UI text constants
│   │   └── validation.ts       # Form validation rules
│   ├── hooks/
│   │   ├── useActionState.ts   # React 19 form action hook
│   │   ├── useComments.ts      # Main comments data hook
│   │   └── useLocalStorage.ts  # LocalStorage wrapper
│   ├── services/
│   │   └── comments/
│   │       ├── db.ts           # Dexie database setup
│   │       ├── service.ts      # CRUD operations
│   │       └── utils.ts        # Tree building utilities
│   ├── types/
│   │   └── comment.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── dateFormat.ts       # Date formatting helpers
│   ├── App.tsx                 # Root application component
│   ├── App.module.css          # Root styles
│   └── main.tsx                # Application entry point
├── e2e/                        # Playwright E2E tests
├── public/                     # Static assets
├── .prettierrc.json            # Prettier config
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies and scripts
```

## Architecture

### Data Flow

1. **Database Layer**: Dexie.js manages IndexedDB operations
2. **Service Layer**: `commentsService` provides CRUD operations
3. **Hook Layer**: `useComments` hook manages state and reactivity using `useLiveQuery`
4. **Component Layer**: React components consume the hook and render UI

**Note**: For production apps, consider:

- Redux Toolkit + Redux-Saga for proper state management instead of direct IndexedDB coupling
- Virtualization (react-window/react-virtual) for handling large lists

### Comment Tree Building

Comments are stored flat in the database with `parentId` references. The `buildCommentTree` utility:

- Converts flat array to nested tree structure
- Respects maximum nesting depth (4 levels)
- Sorts root comments by newest first
- Sorts replies chronologically
- Calculates child counts for collapse indicators

### Form Handling

No form libraries used - leveraging React 19's built-in `useActionState` hook instead. While using `react-hook-form` would provide cleaner code with built-in validation, dirty state tracking, and form management utilities, I chose to use React 19's native APIs to demonstrate familiarity with the latest React features.

## Security Considerations

### XSS Protection

This application is protected against XSS attacks through React's built-in security features:

1. **Automatic escaping**: React automatically escapes all values rendered with JSX `{}` syntax
2. **Text-only rendering**: All user input (comments and author names) is rendered as plain text
3. **No dangerous APIs**: The application doesn't use `dangerouslySetInnerHTML`

Additional sanitization libraries like DOMPurify were considered but deemed unnecessary since React's default behavior provides sufficient protection for this use case.
