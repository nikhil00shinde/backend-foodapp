const express = require("express");
const userRouter = express.Router();
const userModel = require("../models/userModel");
const {getAllUser,getUser,deleteUser,updateUser, updateProfileImage} = require("../controller/userController")
const {login,signup,protectRoute,isAuthorised,forgetpassword,resetpassword,logout} = require("../controller/authController");
const multer = require("multer");

// user ke options
userRouter.route("/:id")
.patch(updateUser)
.delete(deleteUser)

userRouter
.route("/signup")
.post(signup)

userRouter
.route("/login")
.post(login)

userRouter
.route("/forgetpassword")
.post(forgetpassword)

userRouter
.route("/resetpassword/:token")
.post(resetpassword)

// multer for fileupload

// upload -> storage, filter
const multiStorage = multer.diskStorage({
  destination:function(req,file,cb){
   cb(null,"public/images")
  },
  filename:function(req,file,cb){
    cb(null,`user-${Date.now()}.jpeg`)
  }
})

const filter = function(req,file,cb){
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else{
    cb(new Error("Not an image! Please upload an image"),false)
  }
}

const upload = multer({
  storage:multiStorage,
  fileFilter:filter
})

userRouter.post("/ProfileImage",upload.single('photo'),updateProfileImage);
// get request
userRouter.get("/ProfileImage",(req,res)=>{
  res.sendFile("D:/Codes/web-d/1.Backend/FoodApp/backend/multer.html");
})


// profile page
userRouter.use(protectRoute)
userRouter.route("/userProfile")
.get(getUser)

// logout
userRouter
.route("/logout")
.get(logout)

// admin specific func
userRouter.use(isAuthorised(["admin"]))
userRouter
.route("/")
.get(getAllUser)

module.exports = userRouter;
