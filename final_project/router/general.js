const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop

// public_users.get("/", function (req, res) {
//   const bookList = Object.values(books);
//   const formattedBookList = JSON.stringify(bookList, null, 2);
//   return res.status(200).json({ books: bookList });
// });

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const bookList = await getBookList();
    const formattedBookList = JSON.stringify(bookList, null, 2);
    return res.status(200).json({ books: bookList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

function getBookList() {
  return new Promise(function (resolve, reject) {
    try {
      const bookList = Object.values(books);
      resolve(bookList);
    } catch (error) {
      reject(error);
    }
  });
}

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   const book = Object.values(books).find((book) => book.isbn === isbn);

//   if (book) {
//     return res.status(200).json({ book: book });
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then(function (book) {
      if (book) {
        return res.status(200).json({ book: book });
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    });
});

function getBookByISBN(isbn) {
  return new Promise(function (resolve, reject) {
    try {
      const book = Object.values(books).find((book) => book.isbn === isbn);
      resolve(book);
    } catch (error) {
      reject(error);
    }
  });
}

// Get book details based on author

// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author.toLowerCase(); // Convert to lowercase
//   const booksArray = Object.values(books);
//   const authorBooks = booksArray.filter((book) =>
//     book.author.toLowerCase().includes(author.toLowerCase())
//   );

//   if (authorBooks.length > 0) {
//     return res.status(200).json({ books: authorBooks });
//   } else {
//     return res.status(404).json({ message: "No books found for the author" });
//   }
// });

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase(); // Convert to lowercase
  getBooksByAuthor(author)
    .then(function (authorBooks) {
      if (authorBooks.length > 0) {
        return res.status(200).json({ books: authorBooks });
      } else {
        return res.status(404).json({ message: "No books found for the author" });
      }
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    });
});

function getBooksByAuthor(author) {
  return new Promise(function (resolve, reject) {
    try {
      const booksArray = Object.values(books);
      const authorBooks = booksArray.filter((book) =>
        book.author.toLowerCase().includes(author)
      );
      resolve(authorBooks);
    } catch (error) {
      reject(error);
    }
  });
}

// Get all books based on title

// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   const booksArray = Object.values(books);
//   const titleBooks = booksArray.filter((book) =>
//     book.title.toLowerCase().includes(title.toLowerCase())
//   );

//   if (titleBooks.length > 0) {
//     return res.status(200).json({ books: titleBooks });
//   } else {
//     return res.status(404).json({ message: "No books found with the title" });
//   }
// });

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const titleBooks = await getBooksByTitle(title);
    if (titleBooks.length > 0) {
      return res.status(200).json({ books: titleBooks });
    } else {
      return res.status(404).json({ message: "No books found with the title" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

function getBooksByTitle(title) {
  return new Promise(function (resolve, reject) {
    try {
      const booksArray = Object.values(books);
      const titleBooks = booksArray.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      resolve(titleBooks);
    } catch (error) {
      reject(error);
    }
  });
}

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const booksArray = Object.values(books);
  const book = booksArray.find((book) => book.isbn === isbn);

  if (book) {
    const reviews = book.reviews;
    return res.status(200).json({ reviews: reviews });
  } else {
    return res.status(404).json({ message: "No book found with the ISBN" });
  }
});

module.exports.general = public_users;
