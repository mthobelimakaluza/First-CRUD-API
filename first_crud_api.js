const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const swaggerUi = require('swagger-ui-express');
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
 * GET /tasks/:id
 * @summary Get a task by ID
 * @param {number} id.path.required - The ID of the task to retrieve
 * @return {object} 200 - The task object
 * @return {object} 404 - Task not found
 */

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).send({ error: `Task ${taskId} not found` });
  }
  res.send(task);
});

/**
 * POST /tasks
 * @summary Create a new task
 * @param {object} request.body.required - The task object to create
 * @return {object} 201 - The created task object
 */

app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    done: req.body.done || false
  };

  if (!newTask.title) {
    return res.status(400).send({ error: 'Bad Request' });
  }

  tasks.push(newTask);
  res.status(201).send(newTask);
}); 

/**
 * GET /tasks
 * @summary Get all tasks
 * @return {array} 200 - An array of task objects
 */
app.get('/tasks', (req, res) => {
  res.send(tasks);
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
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).send({ error: `Task ${taskId} not found` });
  }
  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;
  res.send(updatedTask);
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
  const taskIndex = tasks.findIndex(t => t.id === taskId); 
  if (taskIndex === -1) {
    return res.status(404).send({ error: `Task ${taskId} not found` });
  }
  tasks.splice(taskIndex, 1);
  res.status(204).send({ message: "No Content" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});