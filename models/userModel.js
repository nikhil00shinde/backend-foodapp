const mongoose = require('mongoose');
const emailValidator = require("email-validator");
const crypto = require("crypto");
const db_link = "mongodb://localhost:27017";


mongoose
.connect(db_link)
.then(()=>{
  console.log("db connected");
})
.catch((err)=>{
  console.log("error")
  console.log(err.message)
});

const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    validate:function(){
         return emailValidator.validate(this.email)
    }
  },
  password:{
    type:String,
    required:true,
    minLength: 8,
  },
  confirmPassword:{
    type:String,
    minLength:8,
    validate: function () {
			return this.confirmPassword == this.password;
		},
  },
  role:{
    type:String,
    enum:['admin',"user","restaurantOwner","deliveryBoy"],
    default:"user"
  },
  profileImage:{
    type:String,
    default:'img/users/default.jpeg'
  },
  resetToken:String
})

userSchema.pre("save",function(){
  console.log(this)
  this.confirmPassword = undefined;
})

userSchema.methods.createResetToken = function(){
  let resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  this.save()
  console.log(this)
  return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password,confirmPassword){
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
}


const userModel = mongoose.model("userModel",userSchema);

module.exports = userModel;

