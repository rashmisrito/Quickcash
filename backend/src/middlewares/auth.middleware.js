const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

module.exports  = {
  verifyToken: async(req,res,next) => {
       
    try {
    
      const token = req.headers?.authorization.replace("Bearer ","");
    
      if(!token) {
        return res.status(401).json({
          status:401,
          message: "Please provide Auth token",
          data: null
        });
      }
 
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         
      if(!decoded) {
        return res.status(401).json({
          status:401,
          message: "Invalid Access token",
          data: null
        });
      }
 
      const user = await User.findById({_id: decoded.data.id}).select("-password");
 
      if(!user) {
        return res.status(401).json({
          status:401,
          message: "Invalid Access token / Invalid User",
          data: null
        });
      }
 
      req.user = user;
      next();
 
    } catch (error) {
      return res.status(403).json({
        status:403,
        message: "Token has been expired / Missing Token",
        data: null
      });
    }
    
  }
}