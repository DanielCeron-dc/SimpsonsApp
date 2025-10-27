# SimpsonsApp

A React Native application showcasing characters from The Simpsons, featuring user authentication, character search, pagination, and note-taking functionality.

## Features

- 🔐 User authentication (register/login)
- 👥 Browse Simpsons characters with pagination
- 🔍 Search characters by name
- 📺 View episodes information
- 📝 Create, edit, and delete notes for characters
- ⚙️ User settings and logout functionality

## Architecture

The app follows a clean, modular architecture with clear separation of concerns:

```
SimpsonsApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── characters/      # Character-related components
│   │   ├── characterDetail/ # Character detail view components
│   │   ├── episodes/        # Episode-related components
│   │   └── SettingsModal.tsx
│   ├── contexts/            # React contexts
│   │   └── SettingsModalContext.tsx
│   ├── navigation/          # Navigation types and configuration
│   │   └── types.ts
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── CharactersScreen.tsx
│   │   ├── CharacterDetailScreen.tsx
│   │   └── EpisodesScreen.tsx
│   ├── services/            # Business logic and data layer
│   │   ├── characters/      # Characters service with adapter pattern
│   │   ├── episodes/        # Episodes service with adapter pattern
│   │   ├── apiClient.ts     # Axios instance for API calls
│   │   ├── authStorageService.ts
│   │   ├── notesStorageService.ts
│   │   ├── simpsonsApiService.ts
│   │   ├── BaseService.ts
│   │   └── BaseAdapter.ts
│   ├── stores/              # Zustand state management
│   │   ├── authStore.ts     # Authentication state
│   │   └── notesStore.ts    # Notes state
│   └── types/               # TypeScript type definitions
│       └── index.ts
├── __tests__/               # Test suites
│   ├── App.test.tsx
│   └── services/
│       ├── charactersService.test.ts
│       └── episodesService.test.ts
└── App.tsx                  # Root component with navigation
```

### Key Architectural Patterns

- **State Management**: Uses Zustand for global state management (auth, notes)
- **Navigation**: React Navigation with separate auth and main navigation stacks
- **Service Layer**: Adapter pattern for API data transformation
  - `BaseService` and `BaseAdapter` for consistent service architecture
  - Separate services for characters, episodes, auth, and notes
- **Data Persistence**: AsyncStorage for local data caching and offline support
- **API Integration**: The Simpsons API for character and episode data

### Data Flow

1. **Components** → Call hooks from stores
2. **Stores (Zustand)** → Manage state and call services
3. **Services** → Handle business logic and call adapters
4. **Adapters** → Transform API DTOs to domain models
5. **API Client** → Makes HTTP requests to external APIs

## Testing

The app includes comprehensive test coverage for core functionality:

- **Unit Tests**: Service layer tests with mocked dependencies
- **Component Tests**: App component rendering tests

Run tests with:
```bash
npm test
```

Test files are located in `__tests__/` directory:
- `App.test.tsx` - App component tests
- `services/charactersService.test.ts` - Characters service tests (caching, search, pagination)
- `services/episodesService.test.ts` - Episodes service tests

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment setup
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```
