# First CRUD API

A simple Express.js CRUD API for managing tasks. The app uses SQLite for persistent storage and includes Swagger documentation.

## Features

- Create, read, update, and delete tasks
- Store tasks in a SQLite database file named `tasks.db`
- Automatically create the `tasks` table on startup
- Insert sample tasks if the database is empty
- Swagger UI available at `/docs`

## Requirements

- Node.js
- npm

## Installation

From the project folder, install dependencies:

```bash
npm install
```

## Run the server

Start the app with:

```bash
node first_crud_api.js
```

The server will run at:

```text
http://localhost:3000
```

## Swagger documentation

Open the API docs in your browser:

```text
http://localhost:3000/docs
```

## API endpoints

### Root

- GET `/`
- Returns basic API information.

### Health check

- GET `/health`
- Returns the server status.

### Tasks

- GET `/tasks`
  - Returns all tasks.

- POST `/tasks`
  - Creates a new task.
  - Body example:

```json
{
  "title": "Read a book",
  "done": false
}
```

- GET `/tasks/:id`
  - Returns a single task by its ID.

- PUT `/tasks/:id`
  - Updates a task by its ID.
  - Body example:

```json
{
  "title": "Go for a walk",
  "done": true
}
```

- DELETE `/tasks/:id`
  - Deletes a task by its ID.

## Example requests

### Get all tasks

```bash
curl http://localhost:3000/tasks
```

### Create a task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Read a book","done":false}'
```

### Get one task

```bash
curl http://localhost:3000/tasks/1
```

### Update a task

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Exercise","done":true}'
```

### Delete a task

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Notes

The app uses an in-memory array for tasks, so data will reset when the server restarts.
