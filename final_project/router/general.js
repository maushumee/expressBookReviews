const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
   const username = req.body.username;
   const password = req.body.password;
   if (username && password) {
       if (isValid(username)) {
           users.push({"username" : username, "password" : password});
           return res.status(200).json({message: "User successfully registred. Now you can login"});
       } else {
           return res.status(404).json({message: "User already exists!"});
       }
   }
   return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
function getAllBooks(){
    return books;
}

public_users.get('/', async (req, res) => {
    try{
        let allBooks = await(getAllBooks());
        return res.status(200).json(allBooks);
    } catch(Error){
        console.log(Error);
        return res.status(404).send("Error getting the books");
    }
 });
 
// Get book details based on ISBN
function getBooksFromISBN(isbn){
    if (books.hasOwnProperty(isbn)){
        return books[isbn];
    }   
    return null;
}

public_users.get('/isbn/:isbn',async (req, res) => {
    const isbn = req.params.isbn; 
    try{
        let details = await(getBooksFromISBN(isbn));
        if (details){
            return res.status(200).json(details);
        }
        return res.status(404).send("ISBN does not exist");
    } catch(Error){
        console.log(Error);
        return res.status(404).send("Error getting the books");
    }   
});

// Get book details based on author
function getBooksFromAuthor(author){
    let booksByAuthor = [];
    let bookIds = Object.keys(books);
    for (let i = 0; i < bookIds.length; i++){
        if (books[bookIds[i]].author == author){
            booksByAuthor.push(books[bookIds[i]]);
        }
    }
    
    if (booksByAuthor.length > 0){
        return booksByAuthor;
    }

    return null;
}

public_users.get('/author/:author', async(req, res) => {
    const author = req.params.author;
    try{
        let details = await(getBooksFromAuthor(author));
        if (details){
            return res.status(200).json(details);
        }
        return res.status(404).send("No Books Exist for Given Author.");
    } catch(Error){
        console.log(Error);
        return res.status(404).send("Error getting the books");
    }
});
 

// Get all books based on title
function getBooksFromTitle(title){
    let booksByTitle = [];
    let bookIds = Object.keys(books);
    for (let i = 0; i < bookIds.length; i++){
        if (books[bookIds[i]].title == title){
            booksByTitle.push(books[bookIds[i]]);
        }
    }
    
    if (booksByTitle.length > 0){
        return booksByTitle;
    }

    return null;
}

public_users.get('/title/:title', async(req, res) => {
    const title = req.params.title;
    try{
        let details = await(getBooksFromTitle(title));
        if (details){
            return res.status(200).json(details);
        }
        return res.status(404).send("No Books Exist for Given Title.");
    } catch(Error){
        console.log(Error);
        return res.status(404).send("Error getting the books");
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;   
   if (books.hasOwnProperty(isbn)){
       if (books[isbn].reviews){
           return res.status(200).json(books[isbn].reviews);
       }
   }
   return res.status(404).json({message: "No Reviews for Given ISBN"});
});

/* // Get the book list available in the shop
public_users.get('/',function (req, res) {
   return res.status(200).json(books);
}); */

/* // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;   
   if (books.hasOwnProperty(isbn)){
       res.status(200).json(books[isbn])
   }   
   return res.status(404).json({message: "ISBN does not exist"});
}); */

/* // Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const author = req.params.author;
   let booksByAuthor = [];
   let bookIds = Object.keys(books);
   for (let i = 0; i < bookIds.length; i++){
       if (books[bookIds[i]].author == author){
           booksByAuthor.push(books[bookIds[i]]);
       }
   }
   if (booksByAuthor.length > 0){
       return res.status(200).json(booksByAuthor);
   }
   return res.status(404).json({message: "No Books Exist for Given Author"});
});
*/

/* // Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
   let booksByTitle = []
   let bookIds = Object.keys(books);
   for (let i = 0; i < bookIds.length; i++){
       if (books[bookIds[i]].title == title){
           booksByTitle.push(books[bookIds[i]]);
       }
   }
   if (booksByTitle.length > 0){
       return res.status(200).json(booksByTitle);
   }
   return res.status(404).json({message: "No Books Exist for Given Title"});
});
*/ 

module.exports.general = public_users;
