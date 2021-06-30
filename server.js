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

app.post('/api/notes', (req, res) => {
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