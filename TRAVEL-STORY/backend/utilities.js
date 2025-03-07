const jwt = require("jsonwebtoken");
const fs = require("fs");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // No token → Unauthorized
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Use 403 for invalid token
    req.user = user;
    next();
  });
}
const writeData = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};

// ✅ Correct way to export both functions
module.exports = { authenticateToken, readData,writeData };




// const jwt = require('jsonwebtoken')

// function authenticateToken(req,res,next){
//     const authHeader = req.headers["authorization"];
//     const token = authHeader &&authHeader.split(" ")[1];

//     //no token unauthorized
//     if(!token) return res.sendStatus(401);

//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
//        if (err) return res.sendStatus(401);
//        req.user = user;
//        next();  
//     });
// }

// module.exports = {
//     authenticateToken
// };