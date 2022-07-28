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

app.listen(5000,()=>{
  console.log("listening")
});

app.use(cookieParser());


app.use("/user",userRouter);
app.use("/plans",planRouter);
app.use("/reviews",reviewRouter)
app.use("/booking",bookingRouter)


