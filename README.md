# Pomodoro Timer App

A Pomodoro Timer application built with Vue 3 + Vite to help users improve productivity and time management skills.

## Project Overview

This Pomodoro Timer app is a time management tool based on the Pomodoro Technique. It allows users to alternate between focused work periods and breaks in a structured way, while also providing task management features to help users better organize and complete their tasks.

## Features

### 1. Three Working Modes
- **Work Mode**: 25 minutes of focused work time
- **Short Break**: 5 minutes of brief rest
- **Long Break**: 15 minutes of extended rest

### 2. Timer Functionality
- Display of remaining time
- Start/Pause/Reset buttons
- Automatic switching between work and break modes with automatic countdown
- Automatic long break after completing 4 pomodoro cycles

### 3. Task Management
- Add tasks
- Mark tasks as completed
- Delete tasks
- Track the number of pomodoros completed for each task

### 4. Task Priority and Categorization
- Set priority levels (high, medium, low) when creating tasks
- Assign tasks to different categories (work, study, personal, other)
- Task card left border color indicates priority (red=high, yellow=medium, green=low)
- Task categories displayed as small tags in the task card

### 5. Task Filtering
- Filter tasks by priority
- Filter tasks by category
- Choose whether to display completed tasks

### 6. Additional Features
- Play notification sound when timer ends
- Display the number of completed pomodoros
- Responsive design that adapts to different screen sizes

## Technology Stack

- **Frontend Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: CSS (custom styles)

## Project Structure

```
pomodoro_app/
├── public/                  # Static assets
│   ├── notification.mp3     # Notification sound file
│   └── tomato.svg           # App icon
├── src/                     # Source code
│   ├── assets/              # Asset files
│   ├── components/          # Components
│   │   ├── Timer.vue        # Timer component
│   │   └── TaskList.vue     # Task list component
│   ├── store/               # State management
│   │   └── index.js         # Pinia store
│   ├── App.vue              # Root component
│   ├── main.js              # Entry file
│   └── style.css            # Global styles
├── index.html               # HTML template
├── package.json             # Project dependencies
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## How to Use

1. Select a working mode (work, short break, or long break)
2. Click the "Start" button to start the timer
3. Focus on work or rest until the timer ends
4. Add tasks and set priorities and categories
5. Check tasks as completed when finished
6. Use filters to find specific tasks

## Installation and Running

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Future Plans

- Add data persistence functionality
- Support customizable work and break durations
- Add statistics and reporting features
- Support multiple languages
- Add dark mode

## Contribution

Issues and feature requests are welcome!

## License

MIT
