Module 8 Three-Screen Task Manager Lab

## About the App

This is my Module 8 lab for CMPS460 Mobile Application Programming. I created a simple task manager using React Native, Expo, and TypeScript. The app lets users add tasks, see their task list, and tap on a task to view more details.

## Features

- **Home Screen:** Welcomes the user and has a button to view tasks.
- **Tasks Screen:** Lets users add tasks and see the tasks they've entered.
- **Task Details Screen:** Shows the selected task's name and ID.
- **Navigation:** Uses stack navigation to move between screens and return to the previous screen.
- **Validation:** Shows an error message if someone tries to add a blank task.
- **Empty State:** Shows a message when no tasks have been added.

## How to Run the App

1. Open the project folder in VS Code.
2. Open the terminal and run `npm install`.
3. Start the app using `npx expo start`.
4. Press `a` to open it on an Android emulator.

## Testing

I tested the app using an Android emulator. I was able to move between all three screens, add a task, open its details, and return to the task list. I also tested adding a blank task and confirmed that the app displayed
