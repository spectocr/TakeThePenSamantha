const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./db/db');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note)
  // return finished code to post route for response
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

// app.delete('/api/notes', (req, res) => {
//   var removeNote = getTodoById(parseInt(req.params.id));
//   if (todo) {
//     removeTodo(parseInt(req.params.id));
//     res.send("ok");
//   } else {
//     res.status(400).send("record not found");
//   }
// });


app.post('/api/notes', (req, res) => {
  req.body.id = notes.length.toString();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

app.get('/api/notes', (req, res) => {
  let results = notes;
  console.log(req.query)
  res.json(results);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});