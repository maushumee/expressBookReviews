const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
   let sameUser = users.filter((user) => user.username == username);
   return sameUser.length == 0;
}


const authenticatedUser = (username,password)=>{ //returns boolean
   let authUser = users.filter((user) => user.username == username && user.password == password);
   return authUser.length > 0;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
   const username = req.body.username;
   const password = req.body.password;


   if (!username || !password) {
       return res.status(404).json({message: "Error logging in"});
   }
   if (authenticatedUser(username,password)) {
       let accessToken = jwt.sign({
           data: password
       }, 'access', { expiresIn: 3600 });
       req.session.authorization = {
           accessToken,username
       }
       return res.status(200).send("User successfully logged in");
   } else {
       return res.status(208).json({message: "Invalid Login. Check username and password"});
   }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const review = req.query.review;
   const isbn = req.params.isbn;
   if (req.session.authorization){
       let username = req.session.authorization['username'];
       books[isbn].reviews[username] = review;
       return res.status(200).json({message: "Your review has been successfully added!"});
   }
   return res.status(403).json({message: "User not logged in"})   
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
   if (req.session.authorization){
       let username = req.session.authorization['username'];
       delete books[isbn].reviews[username];
       return res.status(200).json({message: "Your review has been successfully deleted!"});
   }
   return res.status(403).json({message: "User not logged in"})   
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
