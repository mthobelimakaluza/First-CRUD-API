const express = require('express');
const app = express();
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
    return res.status(404).send({ error: `Task${taskId} not found` });
  }
  res.send(task);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});