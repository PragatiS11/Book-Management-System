const express = require("express");
const { BookModel } = require("../model/bookmodel");
const { auth } = require("../middleware/auth.middleware.js");
const { rateLimiter } = require("../middleware/rateLimiter.middleware.js");

const bookRouter = express.Router();

bookRouter.use(rateLimiter);

bookRouter.post("/create", auth, async (req, res) => {
  try {
    const roles = req.body.roles || [];
    // console.log(roles , "assiusg")

    if (
      roles.includes("CREATOR") 
    ) {
      const book = new BookModel({
        title: req.body.title,
        year: req.body.year,
        createdBy: req.body.createdBy,
        userID: req.body.userID,
        roles: roles,
      });

      await book.save();
      res.status(200).send({ msg: "A new book has been added" });
    } else {
      res.status(403).send({ msg: "Unauthorized to add a book" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


bookRouter.get("/", auth , async (req, res) => {
  
  const roles = req.body.roles || [];
  try {
      if(roles.includes("VIEW_ALL") || roles.includes("CREATOR") ){
        const books = await BookModel.find();
        res.status(200).send(books);
      }
      else if (roles.includes("VIEWER")){
        const books = await BookModel.find({ userID: req.body.userID });
        res.status(200).send(books);
      } 
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

bookRouter.patch("/update/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const book = await BookModel.findOne({ _id: id });
    if (!book) {
      return res.status(404).send({ msg: "Book not found" });
    }

    if (req.body.roles.includes("CREATOR")) {
      await BookModel.findByIdAndUpdate(
        { _id: id },
        {
          title: req.body.title,
          year: req.body.year,
        }
      );

      res.status(200).send({ msg: "Book has been updated" });
    } else {
      res.status(403).send({ msg: "Unauthorized to update this book" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

bookRouter.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BookModel.findOne({ _id: id });
    if (!book) {
      return res.status(404).send({ msg: "Book not found" });
    }

    if (req.body.roles.includes("CREATOR")) {
      await BookModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: "Book has been deleted" });
    } else {
      res.status(403).send({ msg: "Unauthorized to delete this book" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  bookRouter,
};
