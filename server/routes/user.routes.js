const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/usermodel");
const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { username, email, pass, roles } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.status(200).send({ msg: "not able to generate hash", error: err });
      } else {
        const user = new UserModel({
          username,
          email,
          pass: hash,
          roles,
        });
        await user.save();
        res
          .status(200)
          .send({ msg: "The new user has been registerd", new_user: req.body });
      }
    });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    // console.log(user)
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        if (result) {
          const token = jwt.sign(
            {
              userID:user._id,
              username: user.username,
              roles: user.roles,
            },
            "masai",
            { expiresIn: "1hr" }
          );
          
          res.status(200).send({ msg: "Login Sucessfull!", token: token , roles: user.roles });
        } else {
          res.status(400).send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.status(400).send({ msg: "User does not exist" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});



module.exports = { userRouter };
