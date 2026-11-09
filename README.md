# Personal Mobile Organizer

**Course:** CMPS460 – Module 8 Assignment

## Project Overview

Personal Mobile Organizer is a mobile task management application developed with React Native, Expo, and TypeScript. It allows users to organize their daily responsibilities through a simple, user-friendly interface.

## Features

- Four screens: Home, Tasks, Task Details, and Settings
- Bottom-tab navigation and stack navigation
- Create, view, edit, and delete tasks
- Delete confirmation to prevent accidental removal
- Persistent task storage using AsyncStorage
- Input validation for empty task titles
- Loading indicators, error messages, and success notifications
- Reusable task item component
- Accessibility labels for interactive elements

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage

## Running the Application

1. Install Node.js and the Expo development tools.
2. Open the project folder in VS Code.
3. Run `npm install`.
4. Run `npx expo start`.
5. Press `a` to launch the Android emulator.

## Screenshots

The `screenshots` folder contains:

- `HomeScreen.png`
- `TasksScreen.png`
- `TaskDetailsScreen.png`
- `SettingsScreen.png`

## Testing

The application was tested using an emulator. Task creation, editing, deletion, navigation, input validation, and persistence after reloading were verified.