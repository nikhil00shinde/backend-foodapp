const express = require('express');
const authRouter = require('./Router/authRouter');
const userRouter = require('./Router/userRouter');
const app = express();

const cookieParser=require('cookie-parser');
const planModel = require("./models/planModel")
const planRouter = require("./Router/planRouter");
const reviewRouter  = require('./Router/reviewRouter');
const bookingRouter = require('./Router/bookingRouter');
app.use(express.json())

// tell app about frontend
app.use(express.static("public/build"))
let port = process.env.PORT || 5000;
app.listen(port,()=>{
  console.log("listening ",port)
});

app.use(cookieParser());


app.use("/user",userRouter);
app.use("/plans",planRouter);
app.use("/reviews",reviewRouter)
app.use("/booking",bookingRouter)


