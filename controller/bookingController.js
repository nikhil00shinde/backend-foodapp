// This is your test secret API key.
let SK = "sk_test_51LP3QLSIJrkFzWYloCT6U2xbvVbfXDvuMW37vC076MpSoFjxWxRgUratLtV0eOLUbWYukaqGe7JsqqjAv3Sup3P9006whgp6mb";
const stripe = require('stripe')(SK);
const userModel = require("../models/userModel");
const planModel = require("../models/planModel")

module.exports.createSession = async function createSession(req,res){
 try{
   let userId = req.id;
   let planId = req.params.id

   let user = await userModel.findById(userId);
   let plan = await planModel.findById(planId);

   const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    customer_email: user.email,
    client_reference_id: plan.id,
    line_items: [
      {
       name:plan.name,
       description:plan.description,
      amount:plan.price * 100,  
      currency:"inr",      
      quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get("host")}/profile`,
    cancel_url: `${req.protocol}://${req.get("host")}/profile`,
  });

  res.status(200).json({
    status:"success",
    session
  })

 }catch(err){
  res.status(500).json({
    err:err.message
  })
 }
}



