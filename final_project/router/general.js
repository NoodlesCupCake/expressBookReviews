const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4));
});


// Get the book list available in the shop
public_users.get('/async/', async function (req, res) {
    try {
        const response = await axios.get('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
        
        const fetchedBooks = response.data;

        return res.status(200).json({ books: fetchedBooks });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
 });

 public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/'+req.params.isbn);
        
        const fetchedBooks = response.data;

        return res.status(200).json({ books: fetchedBooks });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorToSearch = req.params.author;
    const matchingBooks = [];

    for (const [bookId, bookDetails] of Object.entries(books)) {
        if (bookDetails.author === authorToSearch) {
            matchingBooks.push({ bookId, ...bookDetails });
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: 'Books not found for the specified author' });
    }
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const response = await axios.get('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/'+req.params.author);
        
        const fetchedBooks = response.data;

        return res.status(200).json(fetchedBooks);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleToSearch = req.params.title;
    const matchingBooks = [];

    for (const [bookId, bookDetails] of Object.entries(books)) {
        if (bookDetails.title === titleToSearch) {
            matchingBooks.push({ bookId, ...bookDetails });
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: 'Books not found for the specified title' });
    }
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const response = await axios.get('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/'+req.params.title);
        
        const fetchedBooks = response.data;

        return res.status(200).json(fetchedBooks);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
