// mongoose ke through connect mongodb 
const mongoose = require('mongoose');
const db_link = "mongodb://localhost:27017"; 
mongoose
.connect(db_link)
.then(()=>{
  console.log("plan db connected");
})
.catch((err)=>{
  console.log("error")
  console.log(err.message)
});

const planSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    maxlength:[20,"plan name should not exceed more than 20 characters"]
  },
  duration:{
    type:Number,
    required:true
  },
  price:{
    type:Number,
    required:[true,"price not entered"]
  },
  ratingAverage:{
    type:Number,
  },
  discount:{
    type:Number,
    validate:[function(){
      return this.discount < 100
    },"dicount should not exceed price"]
  },
  numberOfReviews:{
    type:Number,
    default:0
  }
});

const planModel = mongoose.model("planModel",planSchema);

// (
  async function createPlan(){
    let planObj = {
      name:"SuperFood7",
      duration:30,
      price:1000,
      ratingAverage:5,
      discount:20,
      numberOfReviews:0
    };

    let data = await planModel.create(planObj);
    // OR
    // const doc = new planModel(planObj);
    // await doc.save()
  }
// )()


module.exports = planModel;