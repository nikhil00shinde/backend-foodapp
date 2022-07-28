// let flag = true; //user looged on or not
const jwt = require("jsonwebtoken");
const JWT_KEY = `${process.env.JWT_KEY}`
function protectRoute(req, res, next) {
	if (req.cookies.login) {
		// verifying token
     let isVerified = jwt.verify(req.cookies.login,JWT_KEY);
		 isVerified ? next() : res.json({message:"Wrong user"})
	} else {
		return res.json({
			message: "Operation not allowed",
		});
	}
}

module.exports = protectRoute;
