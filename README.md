# XStream - Movie Streaming App

XStream is a React-based web application that allows users to browse movies by genre, category, or search, view movie details and trailers, and manage a personalized "My List" of favorite movies. It integrates Firebase for user authentication and uses local storage to persist user-specific movie lists across sessions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Components](#components)
- [Utilities](#utilities)
- [API Integration](#api-integration)
- [Local Storage](#local-storage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Movie Browsing**: Explore movies by genres (e.g., Action, Comedy), categories (Trending, New Releases, Popular), or search queries.
- **Movie Details**: View detailed information (overview, release date, rating, runtime) and trailers for selected movies in a modal.
- **User Authentication**: Sign in/out using Firebase Authentication with email/password.
- **My List**: Authenticated users can add/remove movies to/from a personalized list, persisted in local storage.
- **Responsive Design**: Built with Bootstrap for a mobile-friendly UI.
- **Animations**: Smooth transitions and hover effects using Framer Motion.
- **Search & Filter**: Search movies with an optional genre filter.
- **Star-rating**

---

## Technologies Used

- **React**: Frontend library for building the UI.
- **React Router**: Client-side routing for navigation.
- **Firebase**: Authentication (email/password).
- **Bootstrap**: CSS framework for styling and responsiveness.
- **Framer Motion**: Animation library for UI effects.
- **Axios**: HTTP client for fetching movie data from The Movie Database (TMDb) API.
- **Local Storage**: Persists user movie lists client-side.
- **The Movie Database (TMDb) API**: Provides movie data (requires an API key).

---

## Prerequisites

- **Node.js**: Version 14.x or higher (includes npm).
- **Firebase Account**: For authentication setup.
- **TMDb API Key**: For movie data (sign up at [TMDb](https://www.themoviedb.org/)).

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Software-Development-Capaciti/Movie-database.git
   cd Movie-database
   npm install
   npm i firebase
   npm run dev