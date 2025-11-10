# Project Overview

This is a web application for managing minibar inventory. It's built with HTML, Tailwind CSS, and vanilla JavaScript for the frontend. The backend is powered by Supabase, which is used for authentication and data storage.

The application allows users to log in, view the current stock levels, see low stock alerts, and track the most consumed items. It also has sections for managing rooms and viewing activity.

# Building and Running

This project does not have a build process. It can be run by opening the `.html` files in the `public` directory directly in a web browser.

1.  **Set up Supabase:**
    *   Create a Supabase project.
    *   Run the SQL from `db/schema.sql` in the Supabase SQL Editor to create the necessary tables and seed data.
    *   In `public/js/supabase-client.js`, replace the placeholder Supabase URL and anon key with your project's credentials.

2.  **Run the application:**
    *   Open `public/index.html` in your web browser to access the login page.
    *   You can log in with the credentials seeded in `db/schema.sql` (e.g., username: `admin`, password: `admin123`).

# Development Conventions

*   **Frontend:** The frontend is built with static HTML files in the `public` directory. Styling is done with Tailwind CSS, and interactivity is added with vanilla JavaScript.
*   **Backend (Supabase):**
    *   The database schema is defined in `db/schema.sql`.
    *   The Supabase client is initialized in `public/js/supabase-client.js`.
*   **Authentication:** The application uses a custom authentication mechanism implemented in `public/js/supabase-client.js` and `public/js/auth.js`. It works by querying the `users` table in Supabase with a username and password. A fallback authentication is also provided for local development.
*   **Modularity:** The JavaScript code is organized into modules. For example, `auth.js` handles authentication, `dashboard.js` handles the dashboard logic, and so on.
*   **Internationalization:** The application has a basic translation mechanism implemented in `public/js/translations.js`.

# Key Files

*   `README.md`: The main README file for the project.
*   `db/schema.sql`: Contains the database schema and seed data.
*   `public/index.html`: The login page for the application.
*   `public/dashboard.html`: The main dashboard page.
*   `public/js/supabase-client.js`: Initializes the Supabase client and contains custom authentication logic.
*   `public/js/main.js`: The main JavaScript file that checks for user authentication.
*   `public/js/auth.js`: Handles the login logic.
*   `public/js/dashboard.js`: Contains the logic for the dashboard page.
*   `public/js/translations.js`: Handles translations for the application.
*   `misc/raw_data.json`: Contains raw data that is inserted into the database.

# MCP USE
Whenever possible, use the supabase mcp to perform queries or just have access to the supabase database to be able to work more efficiently.