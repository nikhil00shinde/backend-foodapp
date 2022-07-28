const planModel = require("../models/planModel");


module.exports.getAllPlans = async function getAllPlans(req,res){
  try{
     let plans = await planModel.find();
     if(plans){
       return res.json({
         message:"all plans retrieved",
         data:plans
       })
     }else{
       return res.json({
         message:"plans not found"
       })
     }
  }catch(err){
      return res.status(500).json({
         message:err.message
      });
  }
} 


module.exports.getPlan = async function getPlan(req,res){
  try{
    let id = req.params.id;
     let plan = await planModel.findById(id);
     if(plan){
       return res.json({
         message:"plan retrieved",
         data:plan
       })
     }else{
       return res.json({
         message:"plan not found"
       })
     }
  }catch(err){
      return res.status(500).json({
         message:err.message
      });
  }
} 


module.exports.createPlan = async function createPlan(req,res){
  try{
     let planData = req.body;
     let createdPlan = await planModel.create(planData);

     res.json({ 
       message:"plan created succesfully",
       data: createdPlan
     })
  }catch(err){
    return res.status(500).json({
      message:err.message
   });
  }
}

module.exports.deletePlan = async function deletePlan(req,res){
  try{
     let id = req.params.id;
     let deletedPlan = await planModel.findByIdAndDelete(id);

     res.json({
       message:"plan deleted succesfully",
       data: deletedPlan
     })
  }catch(err){
    return res.status(500).json({
      message:err.message
   });
  }
}

module.exports.updatePlan = async function updatePlan(req,res){
    try{
    let id = req.params.id;
    let dataToBeUpdated = req.body;
    let keys = [];
    for(let key in dataToBeUpdated){
      keys.push(key);
    }
    let plan = await planModel.findById(id);
    for(let key in keys){
      plan[keys[key]] = dataToBeUpdated[keys[key]]
    }
    console.log(plan)
    // doc
    let plan2 = await plan.save();
    res.json({
      message:"plan updated  successfully",
      data:plan2
    })
    }catch(err){
      res.status(500).json({
        message:err.message
      })
    }
}

// get top 3 plans

module.exports.top3Plans = async function top3Plans(req,res){
  try{
      const plan3 = await planModel.find().sort({ratingAverage:-1}).limit(3);

       return res.json({
         message:"top 3 plans",
         data:plan3
       })

  }catch(err){
   res.status(500).json({
     message:err.message
   })
  }
}
