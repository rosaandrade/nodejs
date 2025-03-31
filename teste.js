// Import necessary modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Session setup to store user login state
app.use(
  session({
    secret: 'secret-key', // You should use a secure secret in production
    resave: false,
    saveUninitialized: true,
  })
);

// In-memory user (hardcoded for simplicity)
const USER = {
  username: 'admin',
  password: 'password',
};

// In-memory todo list
let todos = [];
let nextId = 1; // For assigning unique IDs to todo items

// Middleware to protect routes
function authMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

// === Authentication Routes ===

// GET /login - Display login form
app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// POST /login - Process login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Check if username and password match
  if (username === USER.username && password === USER.password) {
    req.session.loggedIn = true;
    res.redirect('/todos');
  } else {
    res.send('<h2>Invalid credentials</h2><a href="/login">Try again</a>');
  }
});

// POST /logout - Log the user out
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// === CRUD Routes (Protected) ===

// GET /todos - Read all todos
app.get('/todos', authMiddleware, (req, res) => {
  const todoListHtml = todos
    .map(
      (todo) => `
      <li>
        ${todo.text}
        <form style="display:inline;" method="POST" action="/todos/${todo.id}/delete">
          <button>Delete</button>
        </form>
        <form style="display:inline;" method="POST" action="/todos/${todo.id}/update">
          <input name="text" value="${todo.text}" />
          <button>Update</button>
        </form>
      </li>`
    )
    .join('');

  res.send(`
    <h2>To-Do List</h2>
    <ul>${todoListHtml}</ul>
    <form method="POST" action="/todos">
      <input name="text" placeholder="New to-do" required />
      <button type="submit">Add</button>
    </form>
    <form method="POST" action="/logout">
      <button>Logout</button>
    </form>
  `);
});

// POST /todos - Create a new todo
app.post('/todos', authMiddleware, (req, res) => {
  const { text } = req.body;
  if (text && text.trim() !== '') {
    todos.push({ id: nextId++, text: text.trim() });
  }
  res.redirect('/todos');
});

// POST /todos/:id/update - Update a todo
app.post('/todos/:id/update', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const todo = todos.find((t) => t.id == id);
  if (todo && text && text.trim() !== '') {
    todo.text = text.trim();
  }
  res.redirect('/todos');
});

// POST /todos/:id/delete - Delete a todo
app.post('/todos/:id/delete', authMiddleware, (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id != id);
  res.redirect('/todos');
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
