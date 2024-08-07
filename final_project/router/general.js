const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
        users.push({username: username, password: password});
        return res.status(200).json({message: "User " + username + " registered successfully"});
    } else {
        return res.status(400).json({message: "User " + username + " already exists"});
    }
  }
  return res.status(422).json({message: "Missing data in the body"});
});

const getBooks = () => Promise.resolve(books);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBooks()
    .then(result => res.status(200).send(JSON.stringify(result)))
    .catch(err => res.status(404).json({message: "Data not found"}));
  
});

const getBooksByIsbn = (isbn) => Promise.resolve(books[isbn]);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn) {
    getBooksByIsbn(isbn)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(404).json({message: `Book with ISBN ${isbn} not found`}));    
  } else {
    return res.status(404).json({message: "Error fetching data"});
  }
  
 });

const getBookDetailsByAuthor = (author) => {
    let result = [];
    Object.keys(books).forEach((key) => {
        let val = books[key];
        if (val["author"] === author) {
            result.push(val);
        }
      });
      return Promise.resolve(result);
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
 
  if (author) {
    getBookDetailsByAuthor(author)
        .then(result => res.status(200).send(JSON.stringify(result)))
        .catch(err => res.status(404).json({message: "Not Found"}));
  } else {
    return res.status(404).json({message: "Error fetching data"});
  }    
});

const getBookDetailsByTitle = (title) => {
    let result = [];
    Object.keys(books).forEach((key) => {
        let val = books[key];
        if (val["title"] === title) {
            result.push(val);
        }
      });
      return Promise.resolve(result);
}  
 
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  
  if (title) {
    getBookDetailsByTitle(title)
    .then(result => res.status(200).send(JSON.stringify(result)))
    .catch(err => res.status(404).json({message: "Not Found"}));
  } else {
    return res.status(404).json({message: "Error fetching data"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn) {
    return res.status(200).send(books[isbn]["reviews"]);
  }
  return res.status(404).json({message: "Not Found"});
 });

module.exports.general = public_users;
