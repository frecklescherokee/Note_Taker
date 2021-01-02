// declare variables
// note title
let noteTitle;
// note text
let noteText;
// note save button
let saveNoteBtn;
// new note button
let newNoteBtn;
// note list
let noteList;


// define the above variables from their classes in notes.html
//if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  // not sure why this query selector is looking for multiple elements... perhaps to listen for a click or hover?
  noteList = document.querySelectorAll('.list-container .list-group');
//}

// Show an element - use on the save button when new note has both title and text
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element - use on the save button when either note title or text is missing
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Route to GET NOTES
// according to assignment, this should read the db.json file and return all saved notes as JSON
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Route to SAVE NOTE
// according to the assignment, this route should receive a new note to save on the request body,
// add it to the db.json file and then return the new note to the client.  
// will need to find a way to give each note a unique id when it's saved
// look into npm packages that can do this
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Route to DELETE NOTE based on a given id
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // hides save button
  // if activenote exists and has an ID, save title and text into noteTitle and noteText
  // if no activeNote, reset/clear out ActiveNote's title and text
  const renderActiveNote = () => {
  // hide the save button
  hide(saveNoteBtn);

  // if the activeNote exists and has an id:
  if (activeNote.id) {
    // make the title and text read only so they can't be edited
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    // set note title and text to ActiveNote's title and text
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.title;
  } 
  // if the activeNote doesn't exist or have an id, set the note title and text to ""
  else {
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    // hide the save button and save ActiveNote's title and text into noteTitle and noteText
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    // hide the save button and clear the ActiveNote's text and title
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  // hide the save button and save ActiveNote's title and text into noteTitle and noteText
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  // hide the save button and clear the ActiveNote's text and title
  renderActiveNote();
};

// if either the note title or text is missing, hide the save button
// if both note title and text exist, show the save button
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    // hide the save note button
    hide(saveNoteBtn);
  } else {
    // show the save note button
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
