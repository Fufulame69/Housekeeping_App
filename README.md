# Minibar Inventory Application

This is a web application for managing minibar inventory, built with HTML, Tailwind CSS, and JavaScript. It uses Supabase for authentication and data storage.

## Setup

1.  **Create a Supabase Project:** If you haven't already, create a new project on [Supabase](https://supabase.com/).

2.  **Configure Supabase Credentials:**
    *   Open the `scripts/supabase-client.js` file.
    *   Replace `'YOUR_SUPABASE_URL'` with your Supabase project URL.
    *   Replace `'YOUR_SUPABASE_KEY'` with your Supabase `anon` key.

3.  **Set up the Database Schema:**
    *   In your Supabase project, go to the SQL Editor.
    *   Create the necessary tables and data by running the SQL commands from the `schema.sql` file.

4.  **Create a User:**
    *   In your Supabase project, go to the Authentication section.
    *   Create a new user with an email and password. You will use these credentials to log in to the application.

## Usage

Once the setup is complete, you can open the `index.html` file in your browser to start using the application.
