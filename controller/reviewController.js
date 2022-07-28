const planModel = require("../models/planModel");
const reviewModel = require("../models/reviewModel")

module.exports.getAllReviews = async function getAllReviews(req,res){
  try{
     const reviews = await reviewModel.find();
     if(reviews){
       return res.json({
         message:"reviews retrivers",
         data:reviews
       })
     }
     else{
       return res.json({
         message:"review not find"
       })
     }
  }catch(err){
    return res.json({
      message:"reviews not find"
    })
  }
}



module.exports.top3Reviews = async function top3Reviews(req,res){
  try{
     const reviews = await reviewModel.find().sort({rating:-1}).limit(3);
     if(reviews){
       return res.json({
         message:"reviews retrivers",
         data:reviews
       })
     }
     else{
       return res.json({
         message:"reviews not find"
       })
     }
  }catch(err){
    return res.json({
      message:"reviews not find"
    })
  }
}



module.exports.getPlanReviews = async function getPlanReviews(req,res){
  try{
    // plan click -> corresponding jitne bhi reviews hei woh leke aane hain

    let planId = req.params.id;
  

    let reviews = await reviewModel.find();
    reviews = reviews.filter(review => review.plan._id == planId)
    return res.json({
         message:"review retrieves for a particular plan succesful",
         data:reviews
       })
  }catch(err){
    return res.json({
      message:"review not find"
    })
  }
}

module.exports.createReview = async function createReview(req,res){
  try{
     let id = req.params.plan;
     const plan = await planModel.findById(id);
     let review = await reviewModel.create(req.body);
  
    
     plan.numberOfReviews = Number(plan.numberOfReviews) +1;
     plan.ratingAverage = (Number(plan.ratingAverage)+Number(req.body.rating))/Number(plan.numberOfReviews);
     await plan.save();
     if(review){
       return res.json({
         message:"review created",
         data:review
       })
     }
     else{
       return res.json({
         message:"review not created"
       })
     }
  }catch(err){
    return res.json({
      message:err.message
    })
  }
}


module.exports.updateReview = async function updateReview(req,res){

  try{
   let planId = req.params.id;
   //  review id from frontend
   let id = req.body.id;
   let dataToBeUpdated = req.body; 
   let review = await reviewModel.findById(id);
   if(review){
     let keys = [];
     for(let key in dataToBeUpdated){
       if(key == "id") continue
       keys.push(key)
      }
      for(let i=0;i<keys.length;i++){
        console.log(keys[i])
        review[keys[i]] = dataToBeUpdated[keys[i]]
      }
       await review.save();
       return res.json({
         message:'review updated succesfull',
         data:review
       })
   }else{
    return res.json({
      message:'review not found',
    })
   }
  }catch(err){
    return res.json({
      message:err.message
    })
  }
}


module.exports.deleteReview = async function deleteReview(req,res){
  try{
   let planId = req.params.id;
   //  review id from frontend
   let id = req.body.id;
   
   let review = await reviewModel.findByIdAndDelete(id);
   if(review){
       return res.json({
         message:'review deleted succesfull',
         data:review
       })
   }else{
    return res.json({
      message:'review not found',
    })
   }
  }catch(err){
    return res.json({
      message:err.message
    })
  }
}
