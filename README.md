# devrecruit-assessment

Here's the updated README with detailed setup instructions tailored for your project:

```markdown
# Project Management Application

This is a Project Management Application built with Django for the backend and React for the frontend. The application allows users to manage projects with features like status management, priority settings, and user assignments.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- CRUD operations for projects
- Assigning users to projects
- Project status management (In Progress, Done, Abandoned, Canceled)
- Project priority settings (Low, Mid, High)
- Responsive design using Bootstrap

## Technologies

- **Backend:** Django, Django REST Framework
- **Frontend:** React, React Router, Bootstrap
- **Database:** SQLite or PostgreSQL
- **Containerization:** Docker, Docker Compose

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Node.js**: [Install Node.js](https://nodejs.org/en/download/) (for local development, if needed)

### Clone the Repository

1. Open your terminal and clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Ensure you have a `Dockerfile` and `docker-compose.yml` set up for the backend service.

3. Build and start the backend container:

   ```bash
   docker-compose up --build backend
   ```

   This command will build the Docker image and start the backend service.


### Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

4. Ensure you have a `Dockerfile` and `docker-compose.yml` set up for the frontend service.

5. Start the frontend container:

   ```bash
   docker-compose up --build frontend
   ```

## Running the Application

1. Ensure both backend and frontend containers are running.
2. Access the application in your browser at:
   ```
   http://localhost:3000
   ```

## API Endpoints

- **GET** `/api/projects/` - List all projects
- **POST** `/api/projects/` - Create a new project
- **PUT** `/api/projects/<id>/` - Update an existing project
- **DELETE** `/api/projects/<id>/` - Delete a project
- **GET** `/api/view-users/` - List all users
- **POST** `/api/register/` - Register and Login Users


