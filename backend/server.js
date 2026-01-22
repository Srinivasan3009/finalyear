const express=require("express");
const cors=require("cors");
require('dotenv').config();
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
app.use(cors());

const MONGO_URI=process.env.MONGO_URI;
const PORT=process.env.port|| 5000;

mongoose.connect(MONGO_URI,{}).then(()=>{
    console.log("DB connected");
    app.listen(PORT,()=>{
    console.log("Server running at port 5000");
});

app.use("/users", require("./routes/userRoutes"));

})