// node appExercise.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

const PORT = 3000;

const users = [{ username: 'admin', password: 'password' }];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let exercises = [];
let exerciseId = 1;

function sortExercises() {
  exercises.sort((a, b) => {
    const dayIndexA = DAYS_OF_WEEK.indexOf(a.day);
    const dayIndexB = DAYS_OF_WEEK.indexOf(b.day);
    if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
    return a.text.localeCompare(b.text);
  });
}

function isDoneToday(lastCompleted) {
  const today = new Date().toDateString();
  return lastCompleted === today;
}

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" required />
      <input name="password" placeholder="Password" type="password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/exercises');
  } else {
    res.send('Invalid credentials. <a href="/login">Try again</a>');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Logout error.');
    res.redirect('/login');
  });
});

app.get('/exercises', isAuthenticated, (req, res) => {
  let previousDay = '';
  let tableRows = exercises.map(ex => {
    let dayHeader = '';
    if (ex.day !== previousDay) {
      dayHeader = `
        <tr style="background:#eee; font-weight:bold;">
          <td colspan="7" style="text-align:center;">${ex.day}</td>
        </tr>
      `;
      previousDay = ex.day;
    }

    return `
      ${dayHeader}
      <tr>
        <td>${ex.day}</td>
        <td>${ex.text}</td>
        <td><img src="${ex.image}" alt="${ex.text}" width="80" /></td>
        <td>${isDoneToday(ex.lastCompleted) ? '✅' : '❌'}</td>
        <td style="text-align:center;">
          <form method="POST" action="/exercises/${ex.id}/mark" style="display:inline;">
            <button style="border:none; background:none; cursor:pointer;" title="Mark as Done">✅</button>
          </form>
        </td>
        <td style="text-align:center;">
          <form method="POST" action="/exercises/${ex.id}/delete" style="display:inline;">
            <button style="border:none; background:none; cursor:pointer;" title="Delete">🗑️</button>
          </form>
        </td>
        <td style="text-align:center;">
          <form method="GET" action="/exercises/${ex.id}/edit" style="display:inline;">
            <button style="border:none; background:none; cursor:pointer;" title="Edit">✏️</button>
          </form>
        </td>
      </tr>
    `;
  }).join('');

  res.send(`
    <style>
      body { font-family: sans-serif; padding: 20px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #ccc; padding: 10px; vertical-align: middle; }
      th { text-align: center; }
      form { margin: 0; padding: 0; display: inline; }
      img { max-height: 60px; border-radius: 4px; }
      input, select, button { margin: 5px; padding: 6px; }
    </style>

    <h2>Weekly Exercise Tracker</h2>

    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Exercise Name</th>
          <th>Image</th>
          <th>Status</th>
          <th>✔️</th>
          <th>🗑️</th>
          <th>✏️</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="7">No exercises added yet.</td></tr>'}
      </tbody>
    </table>

    <h3>Add New Exercise</h3>
    <form method="POST" action="/exercises">
      <select name="day" required>
        <option value="">Select Day</option>
        ${DAYS_OF_WEEK.map(d => `<option value="${d}">${d}</option>`).join('')}
      </select>
      <input name="text" placeholder="Exercise name" required />
      <input name="image" placeholder="Image URL (optional)" />
      <button type="submit">Add</button>
    </form>

    <form method="POST" action="/exercises/reset" style="margin-top: 10px;">
      <button>Reset Today's Progress</button>
    </form>

    <form method="POST" action="/logout" style="margin-top: 10px;">
      <button>Logout</button>
    </form>
  `);
});

app.post('/exercises', isAuthenticated, (req, res) => {
  const { text, image, day } = req.body;
  if (!text.trim() || !day) {
    return res.send('Exercise name and day are required. <a href="/exercises">Go back</a>');
  }

  exercises.push({
    id: exerciseId++,
    text,
    image: image || 'https://via.placeholder.com/120',
    day,
    lastCompleted: null
  });

  sortExercises();
  res.redirect('/exercises');
});

app.post('/exercises/:id/mark', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const exercise = exercises.find(e => e.id === id);
  if (exercise) {
    exercise.lastCompleted = new Date().toDateString();
    res.redirect('/exercises');
  } else {
    res.send('Exercise not found. <a href="/exercises">Back</a>');
  }
});

app.post('/exercises/:id/delete', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  exercises = exercises.filter(e => e.id !== id);
  res.redirect('/exercises');
});

app.get('/exercises/:id/edit', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const exercise = exercises.find(e => e.id === id);
  if (!exercise) {
    return res.send('Exercise not found. <a href="/exercises">Back</a>');
  }

  res.send(`
    <h2>Edit Exercise</h2>
    <form method="POST" action="/exercises/${exercise.id}/edit">
      <label>Day:</label>
      <select name="day" required>
        ${DAYS_OF_WEEK.map(d => `<option value="${d}" ${exercise.day === d ? 'selected' : ''}>${d}</option>`).join('')}
      </select><br/>
      <label>Name:</label>
      <input name="text" value="${exercise.text}" required /><br/>
      <label>Image URL:</label>
      <input name="image" value="${exercise.image}" /><br/>
      <button type="submit">Save</button>
    </form>
    <a href="/exercises">Cancel</a>
  `);
});

app.post('/exercises/:id/edit', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const exercise = exercises.find(e => e.id === id);
  if (!exercise) {
    return res.send('Exercise not found. <a href="/exercises">Back</a>');
  }

  const { text, image, day } = req.body;
  exercise.text = text;
  exercise.image = image || 'https://via.placeholder.com/120';
  exercise.day = day;

  sortExercises();
  res.redirect('/exercises');
});

app.post('/exercises/reset', isAuthenticated, (req, res) => {
  exercises.forEach(e => e.lastCompleted = null);
  res.redirect('/exercises');
});

app.get('/', (req, res) => {
  res.redirect('/exercises');
});

app.listen(PORT, () => {
  console.log(`✅ Exercise tracker running at http://localhost:${PORT}`);
});
