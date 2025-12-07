# ErvaLearn

Course work in User Interface Development. A Single Page Application (SPA) for language learning and progress monitoring.

## Overview

ErvaLearn is a modern web application designed to help users track their language learning progress across multiple languages. The application provides an intuitive interface for managing courses, tasks, vocabulary, and test cards with real-time progress tracking.

## Features

### Course Management

- **Multi-language Support**: Track progress across French, Portuguese, Italian, and German
- **Progress Tracking**: Visual progress indicators showing completion percentage for each course
- **Dynamic Updates**: Course progress automatically recalculates when tasks are added or completed

### Task Management

- **Task Creation**: Add new tasks with the following options:
  - Task types: Reading, Writing, Listening, Speaking
  - Language assignment
  - Time scheduling
  - Custom titles
- **Task Operations**:
  - Edit existing tasks
  - Delete tasks
  - Mark tasks as complete/incomplete
- **Filtering**: Filter tasks by language and/or task type in the planning section
- **Real-time Updates**: Lesson counts and progress percentages update automatically

### Dictionary

- **Word Management**: View and manage vocabulary words
- **Completion Tracking**: Mark words as learned
- **Multi-language Support**: Words organized by language

### Test Cards

- **Flashcard System**: Practice vocabulary with question-answer cards
- **Progress Tracking**: Track completion progress for each test card set
- **Completion Status**: Mark test cards as completed

### Statistics Dashboard

- **Overview Metrics**: View courses completed, points gained, courses in progress, and tasks finished
- **Progress Charts**: Visual representation of learning progress over time
- **User Profile**: Display user information and plan details

## Architecture

The application follows a component-based architecture with clear separation of concerns:

- **Models**: Data management (`TaskModel`, `CourseModel`, `DictionaryModel`, `TestCardModel`)
- **Components**: Reusable UI components extending `AbstractComponent`
- **Presenters**: Handle rendering logic and user interactions
- **Framework**: Custom rendering framework for component composition

## Technologies

- **Vanilla JavaScript**: No external libraries or frameworks
- **ES6 Modules**: Modern JavaScript module system
- **CSS3**: Custom styling with CSS variables for theming

## Current Functionality

- ✅ Mock data initialization for tasks, dictionary words, and test cards
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Task completion with loading states
- ✅ Course progress calculation based on completed tasks
- ✅ Filtering system for tasks (by language and type)
- ✅ Dictionary word completion
- ✅ Test card completion
- ✅ Real-time UI updates and progress recalculation
- ✅ Responsive design with modern UI/UX

## Getting Started

1. Open `index.html` in a modern web browser
2. The application will initialize with mock data
3. Start managing your language learning tasks and track your progress!

## Project Structure

```
src/
├── view/     # UI components
├── framework/      # Rendering framework
├── model/          # Data models
├── mock/           # Mock data
└── presenter/      # Presentation logic
```
