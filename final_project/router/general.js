const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  console.log(users);
  if (username && password) {
    if (!isValid(username)) {
        console.log("going here")
        users.push({username: username, password: password});
        return res.status(200).json({message: "User " + username + " registered successfully"});
    } else {
        return res.status(400).json({message: "User " + username + " already exists"});
    }
  }
  return res.status(422).json({message: "Missing data in the body"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn) {
    return res.status(200).send(books[isbn]);
  }
  return res.status(404).json({message: "Not Found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book;

  if (author) {
    Object.keys(books).forEach((key) => {
        let val = books[key];
        if (val["author"] === author) {
            book = val;
        }
      });
      if (book) {
        return res.status(200).send(book);
      }
  }
  
  return res.status(404).json({message: "Not Found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book;

  if (title) {
    Object.keys(books).forEach((key) => {
        let val = books[key];
        if (val["title"] === title) {
            book = val;
        }
      });
      if (book) {
        return res.status(200).send(book);
      }
  }
  
  return res.status(404).json({message: "Not Found"});
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
