/**
 * [
 *    {
 *      id: <string | number>
 *      title: <string>
 *      author: <string>
 *      year: <number>
 *      timestamp: <string>
 *      isComplete: <boolean>
 *    }
 * ]
 */



const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS_APPS';

function generateId() {
  return +new Date();
}

function generateNewBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (const todoItem of books) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(newBook) {
  const {id, title, author, year, isComplete} = newBook;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow', 'list-item')
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoBookFromComplete(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookFromComplete(newBook.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addBookToComplete(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookFromComplete(newBook.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addTodo() {
  const inTitle = document.getElementById('title').value;
  const inAuthor = document.getElementById('author').value;
  const inYearString = document.getElementById('date').value; // Retrieve input value as a string
  const inYear = parseInt(inYearString, 10); // Convert the string to a number using parseInt()

  // Validasi panjang input
  if (inYearString.length !== 4) {
    alert("Harap masukkan tahun yang terdiri dari 4 digit.");
    return;
  }

  // Periksa apakah nilai yang di-parse adalah angka yang valid
  if (isNaN(inYear)) {
    alert("Harap masukkan tahun yang valid.");
    return;
  }

  const generatedID = generateId();
  const newBook = generateNewBook(generatedID, inTitle, inAuthor, inYear, false);
  books.push(newBook);

  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('date').value = '';

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToComplete(bookId) {
  const todoTarget = findBook(bookId);

  if (todoTarget == null) return;

  todoTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromComplete(bookId) {
  const todoTarget = findBookIndex(bookId);

  if (todoTarget === -1) return;

  books.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromComplete(bookId) {

  const todoTarget = findBook(bookId);
  if (todoTarget == null) return;

  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBooks = document.getElementById('books');
  uncompleteBooks.innerHTML = '';

  const completeBooks = document.getElementById('complete');
  completeBooks.innerHTML = '';
  
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBooks.append(bookElement);
    } else {
      uncompleteBooks.append(bookElement);
    }
  }
})

function searchBooks() {
  const input = document.getElementById('searchInput').value.toUpperCase();
  const uncompleteBooks = document.getElementById('books');
  const completeBooks = document.getElementById('complete');

  for (const bookItem of books) {
      const title = bookItem.title.toUpperCase();
      const bookElement = document.getElementById(`book-${bookItem.id}`);
      if (title.includes(input)) {
          bookElement.style.display = '';
          if (bookItem.isComplete) {
              completeBooks.appendChild(bookElement);
          } else {
              uncompleteBooks.appendChild(bookElement);
          }
      } else {
          bookElement.style.display = 'none';
      }
  }
}
