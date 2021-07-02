const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./db/db');
const { v4: uuidv4 } = require('uuid');


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

function findById(id, notesArray) {
  const narray = JSON.parse(notesArray);
  //console.log(narray.notes);
  const result = narray.notes.filter(note => note.id !== id);
  console.log(result);
  //notesArray.push(result)
  // return finished code to post route for response
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: result }, null, 2)
    
  );
  
  return result;
}


app.delete('/api/notes/:id', (req, res) => {
  var removedNote = req.params.id;
  //console.log(removedNote);
  if (removedNote) {
    const notes = fs.readFileSync("db/db.json", "utf8");
      JSON.parse(notes, null, 2);
      //console.log(notes);
      let results = findById(removedNote, notes);
      //console.log(notes);
      //return result;

      
      // have notes as an array, need to filter the array of notes to remove the note with the id that matches the 
      //id of req.parms.id
      // after that we need to write to the file again with the filtered list.
      
      res.json(results);
  } else {
    res.status(400).send("record not found");
  }
});


app.post('/api/notes', (req, res) => {
  req.body.id = uuidv4();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

app.get('/api/notes', (req, res) => {
  let results = notes;
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