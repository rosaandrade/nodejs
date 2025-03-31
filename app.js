/*
Application Purpose: 
- Term Project - CRUD Application
Group Members:
- Rosana de Andrade - ID: 200558134
- Leonardo Figueiredo - ID: 200577759
- Driely de Souza Mota - ID: 200565192
- Rafael Barroso Rodrigues - ID: 200568204
*/

// node app.js

const express = require('express'); // Import the Express framework for building web apps
const session = require('express-session'); // Middleware to manage user sessions (login/logout)
const bodyParser = require('body-parser'); // Parses form data sent in POST requests
const app = express(); // Initialize the Express application

//------------------------------------------------------------------------------------
//Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));

/*
Parses form submissions (application/x-www-form-urlencoded).
extended: true allows nested objects in forms.
Creates secure session cookies for login tracking.
*/
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));
//------------------------------------------------------------------------------------
//Constants and Sample Data
const PORT = 3000;// Server runs on localhost:3000

const users = [{ username: 'admin', password: 'password' }]; // Hardcoded user data for authentication

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];// Days to organize exercises
const exerciseTypes = ['Abs', 'Cardio', 'Flexibility', 'Strength', 'Balance', 'Endurance', 'Agility', 'Speed', 'Power', 'Coordination'];// Different categories of exercises

let exercises = []; // Main array storing all exercise entries
let exerciseId = 1; // Auto-incremented ID for new exercises

const sampleExercises = require('./data/sampleExercises.js'); // Loads sample data
//------------------------------------------------------------------------------------
// Helper function to sort exercises by day and name

function sortExercises() {
  exercises.sort((a, b) => {
    const dayIndexA = DAYS_OF_WEEK.indexOf(a.day);
    const dayIndexB = DAYS_OF_WEEK.indexOf(b.day);
    if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
    return a.text.localeCompare(b.text);
  });
}
//Checks if exercise was completed today
function isDoneToday(lastCompleted) {
  const today = new Date().toDateString();
  return lastCompleted === today;
}
// Middleware for login protection
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}
//-------------------------------------------------------------------------------------
/* Routes Explaination
GET /login - Displays the login form 
Shows a login form with HTML & CSS embedded.
No external view files used (pure HTML in res.send()).
*/
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
//--------------------------------------------------------------------------------------
/* POST /login - Processes the login form
Checks if the provided username and password match the hardcoded values in the users array.
If they do, the user is logged in and redirected to the exercises page. If not, an error message is displayed.
*/
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
//---------------------------------------------------------------------------------------
/* POST /logout - Logs the user out
Destroys the session and redirects to the login page.
*/
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Logout error.');
    res.redirect('/login');
  });
});

//---------------------------------------------------------------------------------------
/* GET /exercises - Displays the exercise tracker page
Main page displaying all exercises grouped by day.
Generates dynamic HTML including:
-Animated cards
-Done/undone buttons
-Edit, delete, mark actions
-A form to add new exercises
Uses CSS for layout/styling and JavaScript for drag animations.
*/
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
        <div class="exercise-type">${ex.type}</div>  
        <div class="exercise-text">${ex.text}</div>
        <div class="exercise-sets">${ex.sets} sets</div>
        <div class="exercise-time">${ex.time}</div>
       

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

  // If no exercises are found, display a message
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Exercise Tracker</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #f0f4f8, #d9e2ec);
          padding: 30px;
          max-width: 1200px;
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
.exercise-type{
width: 80px;}
          .exercise-type,
          .exercise-text,
          .exercise-sets,
          .exercise-time {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .exercise-sets,
          .exercise-time {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .exercise-card {
            display: grid;
            grid-template-columns:
              80px       /* type */
              1fr        /* text */
              100px       /* sets */
              100px       /* time */
              100px      /* image */
              50px       /* status */
              minmax(180px, 1fr); /* actions */
            align-items: center;
            gap: 16px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-top: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
        .exercise-card:hover {
          transform: translateY(-2px);
        }
        .exercise-img img {
          width: 100%;
          max-height: 60px;
          object-fit: contain;
          border-radius: 6px;
        }
        .exercise-status {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          width: 50px;
        }
        .exercise-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap; /* Prevents wrapping */
          background: #f9f9f9;
          padding: 8px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          opacity: 0.6;
          transition: opacity 0.3s ease;


        }
        .exercise-actions form {
          display: inline-block; /* Ensures buttons don’t stack */
          margin: 0;
        }

        .exercise-actions button {
            background: transparent;
            border: none;
            font-size: 18px;
            padding: 6px 8px;
            border-radius: 6px;
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 0.3s ease;
        }

        .exercise-actions button:hover {
          background-color: #e0e0e0;
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
          display: grid;
          gap: 12px;
        }
        form[action="/exercises"] select,
        form[action="/exercises"] input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-sizing: border-box;
          font-size: 16px;
        }
        form[action="/exercises"] button {
          background:rgb(71, 73, 75);
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
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          flex-wrap: nowrap; /* 👈 prevents wrapping */
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
        .extra-buttons form {
          display: inline-block; /* 👈 this ensures buttons don’t stack */
          margin: 0;
        }

      }
      </style>
    </head>
    <body>
      <h2>Weekly Exercise Tracker</h2>
      ${tableRows || '<p>No exercises added yet.</p>'}
      <br>
      <hr>
      <form method="POST" action="/exercises">
        <h3>Add New Exercise</h3>
        <select name="day" required>
          <option value="">Select Day</option>
          ${DAYS_OF_WEEK.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>

        <select name="type" required>
          <option value="">Exercise type</option>
          ${exerciseTypes.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>

    
        <input name="text" placeholder="Exercise name" required />

        <input name="sets" placeholder="Sets" required />
        <input name="time" placeholder="Time (e.g., 10 min)" required />
        <input name="image" placeholder="Image URL (optional)" />
        <button type="submit" title="Add Exercise">
          <i class="fas fa-plus"></i>
        </button>
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



//--------------------------------------------------------------------------------------
/* POST /exercises - Adds a new exercise
Creates a new exercise entry based on form data.
Validates input and adds it to the exercises array.
Redirects to the main exercises page after adding.
*/
app.post('/exercises', isAuthenticated, (req, res) => {
  const { type,text,  sets, time, image, day } = req.body;
  if (!text.trim() || !day) {
    return res.send('Exercise name and day are required. <a href="/exercises">Go back</a>');
  }

  exercises.push({
    id: exerciseId++,
    type,
    text,
    sets,
    time,
    image: image || 'https://via.placeholder.com/120',
    day,
    lastCompleted: null,
  });

  sortExercises();
  res.redirect('/exercises');
});

//--------------------------------------------------------------------------------------
/* POST /exercises/load-sample - Loads sample exercises
Loads sample data from a file.
*/

app.post('/exercises/load-sample', isAuthenticated, (req, res) => {
  exercises = [...sampleExercises];
  exerciseId = Math.max(...exercises.map(e => e.id)) + 1;
  
  sortExercises();
  res.redirect('/exercises');
});
//--------------------------------------------------------------------------------------
/* POST /exercises/:id/mark - Marks an exercise as done
* Marks the exercise with the given ID as completed today.
* Updates the lastCompleted date to today.
* Redirects to the main exercises page.
*/

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

//--------------------------------------------------------------------------------------
/* POST /exercises/:id/unmark - Unmarks an exercise as done
* Unmarks the exercise with the given ID as not completed.
* Sets the lastCompleted date to null.
* Redirects to the main exercises page.
*/

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

//--------------------------------------------------------------------------------------
/* POST /exercises/:id/delete - Deletes an exercise
* Deletes the exercise with the given ID from the exercises array.
* Redirects to the main exercises page after deletion.
*/
app.post('/exercises/:id/delete', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  exercises = exercises.filter(e => e.id !== id);
  res.redirect('/exercises');
});

//--------------------------------------------------------------------------------------
/* GET /exercises/:id/edit - Displays the edit form for an exercise
* Displays a form to edit the exercise with the given ID.
* The form is pre-filled with the current exercise data.
* Uses HTML and CSS for styling.
*/
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
        
        <label>Exercise Type</label>
        <select name="type" required>
          ${exerciseTypes.map(d => `<option value="${d}" ${exercise.type === d ? 'selected' : ''}>${d}</option>`).join('')} 
        </select>

        <label>Name</label>
        <input name="text" value="${exercise.text}" required />

        <label>Sets</label>
        <input name="sets" value="${exercise.sets}" required />

        <label>Time</label> 
        <input name="time" value="${exercise.time}" required />


        <label>Image URL</label>
        <input name="image" value="${exercise.image}" />

        <button type="submit">Save</button>
      </form>
      <a class="cancel-link" href="/exercises">Cancel</a>
    </div>
  `);
});

//--------------------------------------------------------------------------------------
/* POST /exercises/:id/edit - Processes the edit form
* Updates the exercise data based on the form submission.
* Validates input and updates the corresponding exercise in the exercises array.
* Redirects to the main exercises page after editing.
*/

app.post('/exercises/:id/edit', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const exercise = exercises.find(e => e.id === id);
  if (!exercise) {
    return res.send('Exercise not found. <a href="/exercises">Back</a>');
  }

  const { text, type,sets,time,image, day } = req.body;
  exercise.type = type;
  exercise.text = text;

  exercise.sets = sets;
  exercise.time = time;
  exercise.image = image || 'https://via.placeholder.com/120';
  exercise.day = day;

  sortExercises();
  res.redirect('/exercises');
});

//--------------------------------------------------------------------------------------
/* POST /exercises/reset - Resets all exercises
* Resets the lastCompleted date for all exercises to null.
* Redirects to the main exercises page after resetting.
*/
app.post('/exercises/reset', isAuthenticated, (req, res) => {
  exercises.forEach(e => e.lastCompleted = null);
  res.redirect('/exercises');
});
//--------------------------------------------------------------------------------------
/* GET / - Redirects to the exercises page
* Redirects the root URL to the exercises page.
* This is the default landing page of the application.
*/
app.get('/', (req, res) => {
  res.redirect('/exercises');
});

//--------------------------------------------------------------------------------------
/* Server Setup
* Starts the Express server on the specified port (3000).
* Logs a message to the console indicating the server is running.
*/
app.listen(PORT, () => {
  console.log(`✅ Exercise tracker running at http://localhost:${PORT}`);
});
