# First CRUD API

This project is a simple Express.js CRUD API for managing tasks. It includes endpoints to list, create, read, update, and delete tasks, plus a basic health check and Swagger documentation.

## Features

- Get API information
- Check server health
- List all tasks
- Create a new task
- Get a single task by ID
- Update a task by ID
- Delete a task by ID
- Swagger UI documentation at `/docs`

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
