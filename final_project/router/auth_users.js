const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    console.log("*****");
    console.log(users);
    let filtered_users = users.filter(u => u.username === username);

    if (filtered_users.length > 0) {
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let filtered_users = users.filter(u => u.username === username && u.password === password );

    if (filtered_users.length > 0) {
        return true;
    }
    return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*60});
        req.session.authorization = { 
            accessToken, username
        }
        return res.status(200).send({message: "User " + username + 
            " logged in successfully"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  }
  return res.status(404).json({message: "Error logging in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review = req.query.review;
  let isbn = req.params.isbn;
  let username = req.session.authorization["username"];
  if (isbn) {
    let book = books[isbn];
    if (review) {
        book.reviews[username] = review;
    }
    return res.status(200).send(book);

  }
  
  return res.status(404).json({message: "Error updating reviews"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization["username"];
    if (isbn && username) {
        let book = books[isbn];
        if (book) {
            if (book.reviews[username]) {
                delete book.reviews[username];
                return res.status(200).send({message: `Review by user [${username}] for ISBN [${isbn}] deleted successfully`});
            } else {
                return res.status(404).send({message: `Review by user [${username}] for ISBN [${isbn}] not found`});
            }
            
        } else {
            return res.status(404).send({message: `ISBN [${isbn}] not found`});
        }
    }
    
    return res.status(404).json({message: "Error deleting review"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
