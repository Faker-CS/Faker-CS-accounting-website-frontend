# Accountant Web Application

This is the frontend for the Accountant application, a comprehensive platform for managing accounting tasks, documents, clients, and real-time communication.

## About The Project

This web application provides a user-friendly interface for both accountants and their clients to interact with the [Accountant API](<link-to-your-backend-repo>). Key features include:

*   **Modern UI:** Built with React and Material-UI for a clean and responsive user experience.
*   **User Authentication:** Secure login and session management.
*   **Dashboard:** An overview of tasks, notifications, and recent activities.
*   **Company & Document Management:** Easily upload, view, and manage client companies and their financial documents.
*   **Form Handling:** Interactive forms for various accounting services like company registration.
*   **Real-time Chat:** Integrated chat for seamless communication between users.
*   **Task & Calendar Management:** Tools to organize workload, track deadlines, and schedule events.
*   **Client Portal:** A dedicated view for clients to track the status of their requests and communicate with their accountant.

## Built With

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Material-UI](https://mui.com/)
*   [React Router](https://reactrouter.com/)
*   [FullCalendar](https://fullcalendar.io/)
*   [Axios](https://axios-http.com/) for API communication
*   [Pusher-JS](https://pusher.com/docs/channels/getting_started/javascript/) & [Laravel Echo](https://laravel.com/docs/11.x/broadcasting#installing-laravel-echo) for real-time features

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Make sure you have Node.js (version 20.x or higher) and yarn installed on your development machine.

*   [Node.js](https://nodejs.org/)
*   [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**
    ```sh
    git clone <your-repo-url>
    cd starter-vite-js
    ```

2.  **Install dependencies**
    ```sh
    yarn install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root of the project. You'll need to add the URL for your backend API.
    ```
    VITE_API_URL=http://localhost:8000/api
    ```

## Running the Application

Once the dependencies are installed and the environment variables are set, you can run the development server.

```sh
yarn dev
```
The application will be available at `http://localhost:3000`.

### Other useful scripts

*   **Build for production:**
    ```sh
    yarn build
    ```
*   **Run linter:**
    ```sh
    yarn lint
    ```
*   **Run E2E tests:**
    ```sh
    yarn test:e2e
    ```

## Connect with the Backend

This frontend application is designed to work with its corresponding backend API. Make sure the API is running and that the `VITE_API_URL` in your `.env` file points to the correct address.

## Full version

- Create React App ([migrate to CRA](https://docs.minimals.cc/migrate-to-cra/)).
- Next.js
- Vite.js

## Starter version

- To remove unnecessary components. This is a simplified version ([https://starter.minimals.cc/](https://starter.minimals.cc/))
- Good to start a new project. You can copy components from the full version.
- Make sure to install the dependencies exactly as compared to the full version.

---

**NOTE:**
_When copying folders remember to also copy hidden files like .env. This is important because .env files often contain environment variables that are crucial for the application to run correctly._
