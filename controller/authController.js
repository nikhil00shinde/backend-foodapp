const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {JWT_KEY} = require("../secrets");
const { sendMail } = require("../utility/nodemailer");


module.exports.signup = async function signup(req,res,next){
	try{
		let dataObj = req.body;
		let user = await userModel.create(dataObj);
    sendMail("signup",user);
		if(user){
			res.json({
				message:"user signed up",
				data:user
			})
		}else{
			res.status(500).json({
				message:"user not defined",
			})
		}
		
	}catch(err){
		res.json({
			message:err.message
		})
	}
     
};

module.exports.login = async function loginUser(req, res) {
	try {
		let data = req.body;
		
		if (data.email) {
			let user = await userModel.findOne({ email: data.email });
			data.name = user.name;

			if (user) {
				// bcrypt -> compare
				if (user.password === data.password) {
					// creating token
					const uid = user['_id']
					const token = jwt.sign({payload:uid},JWT_KEY);
					res.cookie("login", token, { httpOnly: true });
					return res.json({
						message: "User has logged in",
						 data:user,
					});
				} else {
					return res.json({
						message: "Wrong Credentials",
					});
				}
			} else {
				return res.json({
					message: "User not found",
				});
			}
		} else {
			return res.json({
				message: "Empty field found",
			});
		}
	} catch (err) {
		// 500 ->  server error (code is fullprove but it is internal server error)
		return res.status(500).json({
			message: err.message,
		});
	}
}

// isAuthorised-> to check the user's role [admin,,user,restuarant,deliveryboy]

module.exports.isAuthorised = function isAuthorised(roles){
  // roles is an array
  return function(req,res,next){
    if(roles.includes(req.role) == true){
      next()
    }else{
      res.status(401 ).json({
        message:"user not allowed"
      })
    }
  }
}

// protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
  try{
  let token;
	if (req.cookies.login) {
		// verifying token
    token = req.cookies.login;
     let payload = jwt.verify(token,JWT_KEY);
    // {payload:lkhblkdj}
    if(payload){
      const user = await userModel.findById(payload.payload);
      req.role = user.role;
      req.id = user.id;
      next();
    }else{
      res.json({
        message:"token is modified, please login again"
      })
    }
	} else {
		// browser
		const client = req.get("User-Agent");
		if(client.includes("Mozilla") == true){
           return res.redirect("/login")
		}
		return res.json({
			message: "Please login",
		});
	}
}catch(err){
  res.json({
    message:err.message
  })
}
} 

// forgetPassword
module.exports.forgetpassword = async function forgetpassword(req,res){
   let {email} = req.body;
	 try{
      const user = await userModel.findOne({email:email});
			if(user){
				// createResetToken is used to create a new token
				const resetToken = user.createResetToken();
				// http://abc.com/resetpassword/resetToken
				let resetPasswordLink = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
				let obj = {
					email,
					resetPasswordLink
				}
				// send email to the user
				// nodemailer
				sendMail("resetpassword",obj)
				res.json({
					message:"Email sended"
				})
			}else{
				return res.json({
					message:"please signup"
				})
			}
	 }catch(err){
		 res.status(500).json({
			 message:err.message
		 })
	 }
}

// resetPassword
module.exports.resetpassword = async function resetpassword(req,res){
	try{
     const token = req.params.token;
		 let {password,confirmPassword} = req.body;

		 const user = await userModel.findOne({resetToken:token});
		 console.log(user)
		 if(user){
			 //resetPasswordHandler will update user's password in db
			 user.resetPasswordHandler(password,confirmPassword);
			 await user.save();
			 res.json({
				 message:"password changed succesfully, please login again"
			 })
		 }else{
			 res.json({
				 message:"user not found"
			 })
		 }
	}catch(err){
     res.json({
			 message:err.message
		 })
	}
}

module.exports.logout = function logout(req,res){
	res.cookie("login","",{maxAge:1});
	res.json({
		message:"user logged out successfully"
	});
}