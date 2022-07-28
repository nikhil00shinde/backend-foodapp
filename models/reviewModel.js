const mongoose = require('mongoose');
const db_link = "mongodb://localhost:27017"; 
mongoose
.connect(db_link)
.then(()=>{
  console.log("review db connected");
})
.catch((err)=>{
  console.log("error")
  console.log(err.message)
});

const reviewSchema = new mongoose.Schema({
  review:{
    type:String,
    required:[true,'review is required']
  },
  rating:{
    type:Number,
    min:1,
    max:10,
    required:[true,'rating is required']
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'userModel',
    required:[true,"review must belong to user"]
  },
  plan:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'planModel',
    required:[true,"review must belong to plan"]
  }
})


// below hook when the find , findById and findOne is called
reviewSchema.pre("find",function(next){
  this.populate({
    path:"user",
    select:"name profileImage",
  }).populate("plan")
  next();
})

const reviewModel = mongoose.model("reviewModel",reviewSchema);

module.exports = reviewModel;