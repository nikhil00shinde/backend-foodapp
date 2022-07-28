const userModel = require("../models/userModel");

module.exports.getUser = async function getUser(req, res) { 
	// console.log(req.query);
	// Read document
  let id = req.params.id;
	let user = await userModel.find(id);
	// let user = await userModel.findOne({ name: "Sarthak" });
  if(user){
     res.json(user);
  }else{
    return res.json({
      message:"users not found"
    })
  }
	
}

// module.exports.postUser = function postUser(req, res) {
// 	users = req.body;
// 	res.json({
// 		message: "data received successfully",
// 		user: req.body,
// 	});
// }

module.exports.updateUser = async function updateUser(req, res) {
	// Update
  try{
  let id = req.params.id;
  if(id){
    let user = await userModel.findById(id)
    let dataToBeUpdated = req.body;
    let keys = []
    for(let key in dataToBeUpdated){
      keys.push(key)
    };
    
    for(let i=0;i<keys.length;i++){
      user[keys[i]] = dataToBeUpdated[keys[i]]
    };
    
    let updatedData = await user.save();
    res.json({
      message: "data updated successfully",
      data: user,
    });
  }else{
    res.json({
      message:"user  not found"
    })
  }
 }catch(err){
   res.json({
     message:err.message
   })
 }
	
}

module.exports.deleteUser = async function deleteUser(req, res) {
	// users = {};
  try{
	let id= req.params.id;
	let user = await userModel.findByIdAndDelete(id);
  if(!user){
    res.json({
      message: "user not found",
    });
  }
	res.json({
		message: "data has been deleted",
		data: user,
	});
 } catch(err){
  res.json({
		message: err.message
	});
 }
}

module.exports.getAllUser = async function getAllUser(req, res) {
  try{
  let users = await userModel.find();
  if(users){
    res.json({
      message:"user retrieved",
      data:users
    });
  }else{
    res.json({
      message:"users not found"
    });
  }
}catch(err){
  res.json({
    message:err.message
  })
}
}

// cookies
// module.exports.setCookies = function setCookies(req, res) {
// 	// res.setHeader("Set-Cookie", "isLoggedIn=true");
// 	res.cookie("isLoggedIn", false, {
// 		maxAge: 1000 * 60 * 60 * 24,
// 		secure: true,
// 		httpOnly: true,
// 	});
// 	res.cookie("isPrimeMember", true);
// 	res.send("cookie has been set");
// }

// module.exports.getCookies =function getCookies(req, res) {
// 	let cookies = req.cookies;
// 	console.log(cookies);
// 	res.send("cookies recieved");
// }

module.exports.updateProfileImage = function updateProfileImage(req,res){
  res.json({
    message:"file uploaded successfully"
  })
}