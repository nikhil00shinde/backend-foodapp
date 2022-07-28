const express = require("express");
const { protectRoute, isAuthorised } = require("../controller/authController");
const { deletePlan,top3Plans,updatePlan,createPlan,getPlan,getAllPlans } = require("../controller/planController");
const planRouter = express.Router();

// all plans leke aayega
planRouter
.route("/allPlans")
.get(getAllPlans)

// top3Plans
planRouter
.route("/top3")
.get(top3Plans)

// own plan -> logged in necessary
planRouter.use(protectRoute)
planRouter
.route('/plan/:id')
.get(getPlan)

// admin nd restaurantowner owner can only create, update or delete plans
planRouter.use(isAuthorised(["admin","restaurantowner"]))
planRouter
.route("/crudPlan")
.post(createPlan)

planRouter
.route("/crudPlan/:id")
.patch(updatePlan)
.delete(deletePlan)


module.exports = planRouter