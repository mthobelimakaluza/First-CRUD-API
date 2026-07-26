
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const swaggerUi = require('swagger-ui-express');
const sqlite3 = require('sqlite3').verbose();

// Opening 'tasks.db' database file
const db = new sqlite3.Database('tasks.db', (err) => {
  if (err) {
    return console.error('Error opening database:', err);
  }
  console.log('Connected to the SQLite database.');
});

// SQL Statement
const createTableQuery = `CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT 0
)`;

// Creating 'tasks' table if it doesn't exist
db.run(createTableQuery, (err) => {
  if (err) {
    return console.error('Error creating tasks table:', err);
  }
  console.log('Tasks table created or already exists.');
});

// Inserting sample data into 'tasks' table if count is 0
db.get('SELECT COUNT(*) AS count FROM tasks', (err, row) => {
  if (err) {
    return console.error('Error checking tasks count:', err);
  }
  if (row.count === 0) {
    const sampleTasks = [
      { title: 'Medication', done: 1 },
      { title: 'Exercise', done: 0 },
      { title: 'Rest', done: 0 }
    ];
    const insertQuery = 'INSERT INTO tasks (title, done) VALUES (?, ?)';
    sampleTasks.forEach(task => {
      db.run(insertQuery, [task.title, task.done], (err) => {
        if (err) {
          return console.error('Error inserting sample task:', err);
        }
        console.log(`Sample task inserted: ${task.title}`);
      });
    });
  }
  else {
    console.log('Sample data already exists in the tasks table.');
  }
});

app.use(express.json());

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'docs', 'openapi.json'), 'utf8')
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3000;

const tasks = [
  { id: 1, title: 'Medication', done: true },
  { id: 2, title: 'Exercise', done: false },
  { id: 3, title: 'Rest', done: false }
];

app.get('/', (req, res) => {
  res.send(
    { "name": "Task API", 
      "version": "1.0" , 
      "endpoints": ["/tasks"]
    });
});

app.get('/health', (req, res) => {
  res.send(
    { "status": "OK" }
  );
});

/**
 * GET /tasks
 * @summary Get all tasks
 * @return {array} 200 - An array of task objects
 */
app.get('/tasks', (req, res) => {
  const getTasksQuery = 'SELECT * FROM tasks';
  db.all(getTasksQuery, [], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Error retrieving tasks from database' });
    }
    res.send(rows);
  });
});


/**
 * GET /tasks/:id
 * @summary Get a task by ID
 * @param {number} id.path.required - The ID of the task to retrieve
 * @return {object} 200 - The task object
 * @return {object} 404 - Task not found
 */

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const getTaskQuery = 'SELECT * FROM tasks WHERE id = ?';
  db.get(getTaskQuery, [taskId], (err, row) => {
    if (err) {
      return res.status(500).send({ error: 'Error retrieving task from database' });
    }
    if (!row) {
      return res.status(404).send({ error: `Task ${taskId} not found` });
    }
    res.send(row);
  });
});

/**
 * POST /tasks
 * @summary Create a new task
 * @param {object} request.body.required - The task object to create
 * @return {object} 201 - The created task object
 */

app.post('/tasks', (req, res) => {
  const { title, done } = req.body;
  const insertTaskQuery = 'INSERT INTO tasks (title, done) VALUES (?, ?)';
  db.run(insertTaskQuery, [title, done], function(err) {
    if (err) {
      return res.status(500).send({ error: 'Error inserting task into database' });
    }
    const newTask = {
      id: this.lastID,
      title,
      done
    };
    if (!newTask.title) {
    return res.status(400).send({ error: 'Bad Request' });
    }
    res.status(201).send(newTask);
  });
});

/**
 * PUT /tasks/:id
 * @summary Update a task by ID
 * @param {number} id.path.required - The ID of the task to update
 * @param {object} request.body.required - The updated task object
 * @return {object} 200 - The updated task object
 * @return {object} 404 - Task not found
 */

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, done } = req.body;
  const updateTaskQuery = 'UPDATE tasks SET title = ?, done = ? WHERE id = ?';
  db.run(updateTaskQuery, [title, done, taskId], function(err) {
    if (err) {
      return res.status(500).send({ error: 'Error updating task in database' });
    }
    if (this.changes === 0) {
      return res.status(404).send({ error: `Task ${taskId} not found` });
    }
    const updatedTask = {
      id: taskId,
      title,
      done
    };
    res.send(updatedTask);
  });
});

/**
 * DELETE /tasks/:id
 * @summary Delete a task by ID
 * @param {number} id.path.required - The ID of the task to delete
 * @return {object} 200 - Confirmation message
 * @return {object} 404 - Task not found
 */

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const deleteTaskQuery = 'DELETE FROM tasks WHERE id = ?';
  db.run(deleteTaskQuery, [taskId], function(err) {
    if (err) {
      return res.status(500).send({ error: 'Error deleting task from database' });
    }
    if (this.changes === 0) {
      return res.status(404).send({ error: `Task ${taskId} not found` });
    }
    res.status(204).send({ message: "No Content" });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});