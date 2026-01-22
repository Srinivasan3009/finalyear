const express=require("express");
const user = require("../models/user.js");
const router= express.Router();

router.post("/register",async(req,res)=>{
    try{
        const { username, email, password}= req.body;
        const existing=await user.findOne({email});
        if(existing){
            return res.status(400).json({message: "User already exits"});
        }
        const users= await user.create({username, email,password});
        return res.status(201).json({message: " User created sucessfully"});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await user.findOne({ email });

    if (!users) {
      return res.status(400).json({ message: "User not found" });
    }

    if (users.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: users._id,
        name: users.name,
        email: users.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports= router;