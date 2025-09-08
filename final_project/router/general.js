const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    // Return error if username or password is missing
    return res.status(404).json({message: "Username or Password is missing. Unable to register user."});
});


// Get the book list available in the shop with promise and async/await 
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN with promise and async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    // Extract the isbn parameter from the request URL
    const isbn = req.params.isbn;

    // Get the book details corresponding to the extracted isbn
    const book = await Promise.resolve(books[isbn]);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.send(JSON.stringify(book, null, 4));

  } catch (error) {
    res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// Get book details based on author with promise and async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    // Extract the author parameter from the request URL
    const author = req.params.author;

    // Filter the books object to find books whose author matches the extracted author parameter
    const filtered_books = await Promise.resolve(
      Object.values(books).filter((book) => book.author === author)
    );

    if (filtered_books.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    // Send the filtered_books array as the response to the client
    res.send(JSON.stringify(filtered_books, null, 4));

  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title with promise and async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    // Extract the title parameter from the request URL
    const title = req.params.title;
    
    // Filter the books object to find books whose title matches the extracted title parameter
    const filtered_books = await Promise.resolve(
      Object.values(books).filter((book) => book.title === title)
    );

    if (filtered_books.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    // Send the filtered_books array as the response to the client
    res.send(JSON.stringify(filtered_books, null, 4));

  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;
  // Send the book details corresponding to the extracted isbn as the response
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
