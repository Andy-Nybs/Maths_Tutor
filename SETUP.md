# Math Tutor App - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── WelcomeScreen.tsx
│   ├── DifficultySelector.tsx
│   ├── DivisionBoard.tsx
│   ├── MultiplicationBoard.tsx
│   ├── HelpPanel.tsx
│   └── ProgressTracker.tsx
├── utils/              # Utility functions
│   ├── problemGenerator.ts
│   ├── validation.ts
│   ├── feedback.ts
│   └── progressTracker.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features

### Problem Types
- **Long Division**: 2-digit to 4-digit numbers
- **Long Multiplication**: 2-digit to 3-digit numbers

### Difficulty Levels
- **Easy**: Basic problems to build confidence
- **Medium**: More challenging combinations
- **Hard**: Complex multi-digit problems

### Learning Features
- Step-by-step guidance with hints
- Contextual tips on demand
- Visual problem layout matching traditional format
- Immediate feedback on answers
- Progress tracking with accuracy statistics
- Streak counter for motivation

### Progress Tracking
- Tracks total problems solved
- Calculates accuracy rate
- Maintains current and max streaks
- Separates stats by problem type
- Persists data using browser localStorage

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Smooth animations
- **Vite**: Fast build tool

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Future Enhancements

- Optional LLM-powered explanations for advanced help
- Gamification features (badges, achievements)
- Multiplayer competitions
- Customizable number ranges
- Detailed progress analytics
- Dark mode theme
