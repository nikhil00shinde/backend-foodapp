const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const JWT_KEY = `${process.env.JWT_KEY}`

authRouter
	.route("/signup")
	.get(middleware1, getSignUp, middleware2)
	.post(postSignUp);

authRouter.route("/login").post(loginUser);

function middleware1(req, res, next) {
	console.log("middleware1 encountered");
	next();
}
function getSignUp(req, res, next) {
	console.log("getSignUp called");
	next();
}

function middleware2(req, res, next) {
	console.log("middleware2 encountered");
	res.sendFile("D:/Old pc data/d/web-d/8.Backend/Express/SignUp/index.html");
}

async function postSignUp(req, res) {
	// Create document in Database
	let dataObj = req.body;
	let user = await userModel.create(dataObj);
	res.json({
		message: "user signed up",
		data: user,
	});
}

async function loginUser(req, res) {
	try {
		let data = req.body;
		if (data.email) {
			let user = await userModel.findOne({ email: data.email });

			if (user) {
				// bcrypt -> compare
				if (user.password === data.password) {
					// creating token
					const uid = user['_id']
					const token = jwt.sign({payload:uid},JWT_KEY);
					res.cookie("login", token, { httpOnly: true });
					return res.json({
						message: "User has logged in",
						userDetails: data,
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

module.exports = authRouter;
