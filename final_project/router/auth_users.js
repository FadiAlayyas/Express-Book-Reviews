const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find the user with the provided username
  const user = users.find((user) => user.username === username);

  // Check if the user exists and the password is correct
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username: user.username }, "secret_key");

  // Save the token in the session
  req.session.token = token;

  return res.status(200).json({ message: "User logged in successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.username; // Get the username from the session
  const isbn = req.params.isbn; // Get the ISBN from the URL parameter
  const review = req.body.review; // Get the review from the request query

  const book = Object.values(books).find((book) => book.isbn === isbn);

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  let userReview;
  if (Array.isArray(book.reviews)) {
    userReview = book.reviews.find(
      (reviewObj) => reviewObj.username === username
    );
  }

  // If the current user has already reviewed the book, modify the existing review
  if (userReview) {
    userReview.review = review;
    return res
      .status(200)
      .json({ message: "Review modified successfully", books: books });
  }

  // If the current user hasn't reviewed the book, add a new review
  const newReview = {
    username: username,
    review: review,
  };

  if (!Array.isArray(book.reviews)) {
    book.reviews = []; // Initialize the reviews property as an empty array
  }

  book.reviews.push(newReview);

  return res
    .status(200)
    .json({ message: "Review added successfully", books: books });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.username; // Get the username from the session
  const isbn = req.params.isbn; // Get the ISBN from the URL parameter
  const book = Object.values(books).find((book) => book.isbn === isbn);
  // Check if the book exists
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  // Find the review index for the current user's review
  const reviewIndex = book.reviews.findIndex(
    (reviewObj) => reviewObj.username === username
  );
  // Check if the review exists for the current user
  if (reviewIndex === -1) {
    return res
      .status(404)
      .json({ message: "Review not found for the current user" });
  }
  // Remove the review from the book's reviews array
  book.reviews.splice(reviewIndex, 1);
  return res.status(200).json({ message: "Review deleted successfully", books: books });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
