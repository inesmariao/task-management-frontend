# Task Management Frontend

This project is a **React** and **Next.js** application designed to interact with the Task Management API. It provides a user-friendly interface for managing tasks, including creating, editing, deleting, and restoring tasks.

Developed by ❤️ **Ing. Inés María Oliveros**.

## Features

- Display tasks grouped by creation month.
- Create, edit, and delete tasks.
- View and restore soft-deleted tasks.
- Interactive user experience with task ratings and priority indicators.
- Integration with the backend API using `Axios`.

## Deploy

Frontend deployed at Vercel:

```plaintext
   https://task-management-inesmariao-h3begxamr.vercel.app/tasks
   ```

Frontend deployed at Render:

```plaintext
   https://task-management-frontend-x0vf.onrender.com
   ```

## Installation

Follow these steps to set up the project on your local machine:

1. Clone this repository:

   ```bash
   git clone https://github.com/inesmariao/task-management-frontend.git
   ```
2. Navigate to the project directory:

   ```bash
   cd task-management-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project - Development Mode

Start the project in development mode with hot-reload:

   ```bash
   npm run dev
   ```
Then, open your browser and navigate to:

   ```plaintext
   http://localhost:3000
   ```

## Project Structure

- src/app: Main directory for Next.js app routing and pages.
- src/styles: Global styles and TailwindCSS configurations.

## How to Use

1. View Tasks: Navigate to /tasks to view all active tasks.
2. Create Task: Click the "Create Task" button to open the task creation form.
3. Edit Task: Click the "Edit" button on any task card to update its details.
4. Delete Task: Click the "Delete" button on any task card to soft-delete it.
5. View Deleted Tasks: Navigate to /tasks/deleted to see all soft-deleted tasks.
6. Restore Task: Click the "Undo Deletion" button on any deleted task card to restore it.

## Technologies Used

- React: For building the user interface.
- Next.js: For server-side rendering and routing.
- Axios: For API communication.
- TailwindCSS: For responsive and modern UI design.
- SweetAlert2: For interactive confirmation dialogs.
- TypeScript: For static typing and improved developer experience.

## Contributing

Contributions are welcome! If you have suggestions or encounter any issues, feel free to submit a pull request or open an issue in this repository.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Backend API developed as part of the Task Management project.
- Special thanks to the open-source community for tools and libraries used in this project.

Developed ❤️ by Ing. Inés María Oliveros