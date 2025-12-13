# ErvaLearn

A Single Page Application (SPA) for tracking English language learning progress. Built as coursework in User Interface Development.

## Overview

ErvaLearn is a modern web application designed to help users track their English language learning progress. The application provides an intuitive interface for managing tasks, practicing with test cards, looking up word definitions, and monitoring learning statistics with real-time progress tracking.

## Features

### Course Dashboard

- **Single Course Focus**: Track progress for English language learning
- **Circular Progress Indicator**: Visual progress bar showing completion percentage
- **Dynamic Updates**: Course progress automatically recalculates when tasks are added or completed
- **Lesson Count**: Displays total number of lessons based on tasks

### Task Management

- **Task Creation**: Add new tasks with the following options:
  - Task types: Reading, Writing, Listening, Speaking
  - Time scheduling (e.g., "8:00 AM - 10:00 AM")
  - Custom titles
- **Task Operations**:
  - Edit existing tasks
  - Delete tasks
  - Mark tasks as complete/incomplete
- **Filtering**: Filter tasks by task type in the planning section
- **Real-time Updates**: Lesson counts and progress percentages update automatically
- **Optimistic Updates**: Instant UI feedback with background API synchronization

### Test Cards

- **Flashcard System**: Practice vocabulary with question-answer cards
- **Show/Hide Answer**: Interactive cards that reveal answers on demand
- **Completion Tracking**: Mark test cards as completed
- **Last Reviewed**: Track when each card was last reviewed
- **Real-time Sync**: Changes sync with MockAPI.io in the background

### Dictionary

- **Live Word Lookup**: Search for English words using DictionaryAPI.dev
- **Comprehensive Definitions**: View word definitions, phonetic pronunciation, part of speech, examples, and etymology
- **Search Interface**: Simple search bar with Enter key support
- **Error Handling**: Graceful fallback when words are not found

### Statistics Dashboard

- **Learning Streak**: Track consecutive learning activity
- **Unfinished Tasks**: Count of incomplete tasks
- **Tasks Finished**: Count of completed tasks
- **Word of the Day**: Daily featured word with definition and example (from curated word list)
- **User Profile**: Display user information
- **Auto-refresh**: Statistics update automatically when tasks change

## Architecture

The application follows a component-based architecture with clear separation of concerns:

- **Models**: Data management (`TaskModel`, `CourseModel`, `TestCardModel`)
- **Views**: Reusable UI components extending `AbstractComponent`
- **Presenters**: Handle rendering logic and user interactions
- **API Service**: Centralized service for external API interactions (`LearningAPIService`)
- **Framework**: Custom rendering framework for component composition

## Technologies

- **Vanilla JavaScript**: No external libraries or frameworks
- **ES6 Modules**: Modern JavaScript module system
- **CSS3**: Custom styling with responsive design
- **MockAPI.io**: Hosted mock API for data persistence (tasks and test cards)
- **DictionaryAPI.dev**: External API for English word definitions

## Data Persistence

The application uses MockAPI.io for data persistence:

- **Tasks**: Stored in `/tasks` endpoint
- **Test Cards**: Stored in `/test-cards` endpoint
- **Fallback**: Uses local mock data if API is unavailable
- **Optimistic Updates**: UI updates immediately, syncs with API in background

See `MOCKAPI_SETUP_GUIDE.md` for detailed setup instructions.

## Current Functionality

- ✅ MockAPI.io integration for tasks and test cards
- ✅ DictionaryAPI.dev integration for word lookups
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Task completion with optimistic updates
- ✅ Course progress calculation based on completed tasks
- ✅ Filtering system for tasks (by type)
- ✅ Test card completion and answer reveal
- ✅ Dictionary word search with live API
- ✅ Word of the Day feature
- ✅ Statistics dashboard with auto-refresh
- ✅ Loading states for async operations
- ✅ Real-time UI updates and progress recalculation
- ✅ Responsive design with modern UI/UX
- ✅ Tab-based navigation (Home, Tests, Dictionary, Settings)

## Getting Started

1. **Set up MockAPI.io** (optional but recommended):

   - Follow the instructions in `MOCKAPI_SETUP_GUIDE.md`
   - Create `/tasks` and `/test-cards` resources
   - Update the `MOCKAPI_BASE` URL in `src/api.js` with your MockAPI.io instance ID

2. **Open the application**:

   - Open `index.html` in a modern web browser
   - The application will initialize with data from MockAPI.io (or fallback to mock data)

3. **Start learning**:
   - Add tasks in the Planning section
   - Practice with test cards in the Tests tab
   - Look up words in the Dictionary tab
   - Track your progress in the statistics section

## Project Structure

```
src/
├── api.js              # API service for MockAPI.io and DictionaryAPI.dev
├── main.js             # Application entry point
├── framework/          # Rendering framework
│   └── view/
│       └── abstract-component.js
├── model/              # Data models
│   ├── course-model.js
│   ├── task-model.js
│   └── test-card-model.js
├── mock/               # Mock data (fallback)
│   ├── english-words.js
│   ├── mock-tasks.js
│   └── mock-test-cards.js
├── presenter/          # Presentation logic
│   ├── main-section-presenter.js
│   └── stats-section-presenter.js
└── view/               # UI components
    ├── course-dashboard.js
    ├── dictionary-section.js
    ├── header.js
    ├── loading.js
    ├── sidebar.js
    ├── stat-blocks.js
    ├── task-form.js
    ├── test-card.js
    └── word-of-the-day.js
```

## API Configuration

The application uses two external APIs:

1. **MockAPI.io**: For data persistence

   - Base URL: `https://[project-id].mockapi.io/api/v1`
   - Endpoints: `/tasks`, `/test-cards`
   - Configure in `src/api.js`

2. **DictionaryAPI.dev**: For word lookups
   - Base URL: `https://api.dictionaryapi.dev/api/v2/entries/en`
   - No authentication required
   - Configure in `src/api.js`

## Browser Support

- Modern browsers with ES6 module support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

This project is coursework for User Interface Development.
