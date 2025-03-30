// node app.js
// node app.js
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

const sampleExercises = [
  { id: 1, text: 'Push-ups', image: 'https://via.placeholder.com/120', day: 'Monday', lastCompleted: null },
  { id: 2, text: 'Squats', image: 'https://via.placeholder.com/120', day: 'Tuesday', lastCompleted: null },
  { id: 3, text: 'Plank', image: 'https://via.placeholder.com/120', day: 'Wednesday', lastCompleted: null }
];


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
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - Exercise Tracker</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #eef2f3, #cfd9df);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .login-card {
          background: white;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        h1 {
          text-align: center;
          margin-bottom: 25px;
        }
        input {
          width: 100%;
          padding: 10px 16px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
        }
          
        button {
          width: 100%;
          padding: 10px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease;
          box-sizing: border-box;
        }
        button:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="login-card">
        <h1>Exercise Tracker</h1>
        <p>Login to your account</p>
        <form method="POST" action="/login">
          <input name="username" placeholder="Username" required />
          <input name="password" placeholder="Password" type="password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </body>
    </html>
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
        <div class="day-group animate__animated animate__fadeIn">
          <h3>${ex.day}</h3>
        </div>
      `;
      previousDay = ex.day;
    }

    return `
      ${dayHeader}
      <div class="exercise-card animate__animated animate__fadeInUp" draggable="true">
        <div class="exercise-text">${ex.text}</div>
        <div class="exercise-img"><img src="${ex.image}" alt="${ex.text}" /></div>
        <div class="exercise-status">${isDoneToday(ex.lastCompleted) ? '✅' : '❌'}</div>
        <div class="exercise-actions">
          <form method="POST" action="/exercises/${ex.id}/mark"><button title="Mark as Done">✅</button></form>
          <form method="POST" action="/exercises/${ex.id}/unmark"><button title="Unmark">❌</button></form>
          <form method="POST" action="/exercises/${ex.id}/delete"><button title="Delete">🗑️</button></form>
          <form method="GET" action="/exercises/${ex.id}/edit"><button title="Edit">✏️</button></form>
        </div>
      </div>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Exercise Tracker</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #f0f4f8, #d9e2ec);
          padding: 30px;
          max-width: 900px;
          margin: 0 auto;
        }
        h2 {
          text-align: center;
          margin-bottom: 40px;
        }
        .day-group h3 {
          margin-top: 30px;
          background: #e0e0e0;
          padding: 10px;
          border-radius: 8px;
        }
        .exercise-card {
          display: grid;
          grid-template-columns: 1fr 100px 80px auto;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 15px;
          border-radius: 10px;
          margin-top: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }
        .exercise-card:hover {
          transform: translateY(-2px);
        }
        .exercise-img img {
          width: 100%;
          height: auto;
          border-radius: 6px;
        }
        .exercise-actions {
            background: linear-gradient(to right, #f0f4f8, #d9e2ec);
            padding: 8px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            gap: 8px;
            transition: background 0.3s ease;
          }
        .exercise-actions form {
          display: inline-block;
          margin: 0;
        }
        button {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
        form[action="/exercises"] {
          margin-top: 40px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        form[action="/exercises"] select,
        form[action="/exercises"] input {
          padding: 8px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        form[action="/exercises"] button {
          background: #007bff;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }
        form[action="/exercises"] button:hover {
          background: #0056b3;
        }
        .extra-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
        }

        .extra-buttons button {
          background-color: #f0f0f0;
          color: #333;
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .extra-buttons button:hover {
          background-color: #dcdcdc;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <h2>Weekly Exercise Tracker</h2>
      ${tableRows || '<p>No exercises added yet.</p>'}

      <form method="POST" action="/exercises">
        <select name="day" required>
          <option value="">Select Day</option>
          ${DAYS_OF_WEEK.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
        <input name="text" placeholder="Exercise name" required />
        <input name="image" placeholder="Image URL (optional)" />
        <button type="submit">Add</button>
      </form>

      <div class="extra-buttons">
        <form method="POST" action="/exercises/reset">
          <button title="Reset All Progress">♻️</button>
        </form>
        <form method="POST" action="/logout">
          <button title="Logout">🚪</button>
        </form>
        <form method="POST" action="/exercises/load-sample">
          <button title="Load Sample Exercises">📥</button>
        </form>
      </div>

      <script>
        document.querySelectorAll('.exercise-card').forEach(card => {
          card.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', card.innerHTML);
            card.classList.add('dragging');
          });

          card.addEventListener('dragend', e => {
            card.classList.remove('dragging');
          });
        });
      </script>
    </body>
    </html>
  `);
});



//-----------------------------
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
app.post('/exercises/load-sample', isAuthenticated, (req, res) => {
  exercises = [...sampleExercises];
  exerciseId = Math.max(...exercises.map(e => e.id)) + 1;
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

app.post('/exercises/:id/unmark', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const exercise = exercises.find(e => e.id === id);
  if (exercise) {
    exercise.lastCompleted = null;
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
//-------------edit page
  res.send(`
    <h1 style="text-align:center;">Weekly Exercise Tracker</h1>

    <style>
      body {
        font-family: Arial, sans-serif;
        background: linear-gradient(to right, #f0f4f8, #d9e2ec);
        padding: 40px;
      }
      .card {
        max-width: 400px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        padding: 30px 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      h2 {
        text-align: center;
        margin-bottom: 25px;
      }
      label {
        display: block;
        margin: 15px 0 5px;
        font-weight: bold;
      }
      input, select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
      }
      button {
        margin-top: 20px;
        width: 100%;
        background:  #007bff;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover {
        background: #0056b3;
      }
      .cancel-link {
        display: block;
        text-align: center;
        margin-top: 15px;
        color: #555;
        text-decoration: none;
      }
      .cancel-link:hover {
        text-decoration: underline;
      }
    </style>
 
    <div class="card">
    
      <h2>Edit Exercise</h2>
      <form method="POST" action="/exercises/${exercise.id}/edit">
        <label>Day</label>
        <select name="day" required>
          ${DAYS_OF_WEEK.map(d => `<option value="${d}" ${exercise.day === d ? 'selected' : ''}>${d}</option>`).join('')}
        </select>

        <label>Name</label>
        <input name="text" value="${exercise.text}" required />

        <label>Image URL</label>
        <input name="image" value="${exercise.image}" />

        <button type="submit">Save</button>
      </form>
      <a class="cancel-link" href="/exercises">Cancel</a>
    </div>
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
