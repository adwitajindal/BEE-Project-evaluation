require("dotenv").config();
const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const upload = require("./multer");
const { authenticateToken, readData ,writeData} = require("./utilities");


// const { authenticateToken } = require("./utilities");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const usersFile = path.join(__dirname, "users.json");
const STORIES_FILE = "stories.json";
// Function to read users.json
const readUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
};

// Function to write to users.json
const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// **SIGNUP API**
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = readUsers();
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, fullName, email, password: hashedPassword };

  users.push(newUser);
  writeUsers(users);

  const accessToken = jwt.sign(
    { userId: newUser.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );

  return res.json({
    error: false,
    message: "Account created successfully",
    user: { fullName, email },
    accessToken,
  });
});




app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare the entered password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );

  res.json({ accessToken, user });
});

// **LOGOUT API** (Logout is handled on frontend)
app.post("/logout", (req, res) => {
  return res.json({ message: "Logged out successfully" });
});





//* GET USER ****************************
app.get("/get-user", authenticateToken, (req, res) => {
    const users = readData(usersFile);
    const user = users.find(user => user.id === req.user.userId);
    if (!user) return res.sendStatus(401);
    res.json({ user, message: "" });
  });
  
  //* ADD TRAVEL STORY ****************************
  app.post("/add-travel-story", authenticateToken, (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }
    
    let stories = readData(STORIES_FILE);
    const newStory = {
      id: Date.now().toString(),
      userId: req.user.userId,
      title,
      story,
      visitedLocation,
      imageUrl,
      visitedDate: new Date(parseInt(visitedDate)), 
      isFavourite: false,
    };
    stories.push(newStory);
    writeData(STORIES_FILE, stories);
    
    res.status(201).json({ story: newStory, message: "Added Successfully" });
  });
  
  //* GET ALL TRAVEL STORIES ****************************
  app.get("/get-all-stories", authenticateToken, (req, res) => {
    const stories = readData(STORIES_FILE).filter(story => story.userId === req.user.userId);
    res.status(200).json({ stories });
  });
  
  //* IMAGE UPLOAD ****************************
  app.post("/image-upload", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: true, message: "No image uploaded" });
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  });

  //***************DELETE AN IMAGE FROM UPLOADS FOLDER*/
  app.delete("/delete-image",async (req,res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
      return res
      .status(400)
      .json({error: true,message: "imageUrl parameter is required"});
    }

    try{
      //extraxt filename from the url
      const filename = path.basename(imageUrl);

      //define the file path
      const filePath = path.join(__dirname,'uploads',filename);

      //check if file exists
      if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
        res.status(200).json({message : "Ïmage deleted successfully"});

      }
      else{
        res.status(200).json({error: true,message: "Image not found"});
      }
      
    }
    catch(error){
      res.status(500).json({error: true,message: error.message});
    }
  });
  
  //* Serve static files ****************************
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use("/assets", express.static(path.join(__dirname, "assets")));
  
//* EDIT TRAVEL STORY ****************************
app.post("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));
  const stories = readData(STORIES_FILE);

  // Find index of the story
  const storyIndex = stories.findIndex(
    (s) => s.id === id && s.userId === userId
  );

  if (storyIndex === -1) {
    return res
      .status(404)
      .json({ error: true, message: "Travel Story not found" });
  }

  const placeholderImgUrl = `http://localhost:8000/assets/placeholder.jpeg`;

  // Update the story
  stories[storyIndex] = {
    ...stories[storyIndex],
    title,
    story,
    visitedLocation,
    imageUrl: imageUrl || placeholderImgUrl,
    visitedDate: parsedVisitedDate,
  };

  writeData(STORIES_FILE, stories);

  res
    .status(200)
    .json({ story: stories[storyIndex], message: "Update Successful" });
});




// DELETE A TRAVEL STORY
app.delete("/delete-story/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    let stories = readData(STORIES_FILE);

    // Find the index of the story
    const storyIndex = stories.findIndex(
      (story) => story.id === id && story.userId === userId
    );

    if (storyIndex === -1) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    // Extract image file path from the story
    const imageUrl = stories[storyIndex].imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    // Remove the image file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove story from array and save
    stories.splice(storyIndex, 1);
    writeData(STORIES_FILE, stories);

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    console.error("Error deleting travel story:", error.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//update isFavourite
app.put("/update-is-favourite/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    let stories = readData(STORIES_FILE);

    // Find index of the story
    const storyIndex = stories.findIndex(
      (story) => story.id === id && story.userId === userId
    );

    if (storyIndex === -1) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    // Update the isFavourite field
    stories[storyIndex].isFavourite = isFavourite;

    // Write back updated stories
    writeData(STORIES_FILE, stories);

    res.status(200).json({
      story: stories[storyIndex],
      message: "isFavourite status updated successfully",
    });
  } catch (error) {
    console.error("Error updating isFavourite:", error.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});











app.listen(8000, () => console.log("Server running on port 8000"));
module.exports = app;





//1:13



//********************************************8 */
// require("dotenv").config();
// const config = require("./config.json");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const express = require("express");
// const cors = require("cors");

// const jwt = require("jsonwebtoken");
// const upload = require("./multer");
// const fs = require("fs");
// const path = require("path");
// const {authenticateToken} = require("./utilities");
// const User=require("./models/user.model");
// const TravelStory= require("./models/travelStory.model");
// mongoose.connect(config.connectionString);

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "*" }));

// // app.get("/hello", async (req, res) => {
// //   return res.status(200).json({ message: "Hello World" });
// // });

// //*create account****************************
// app.post("/create-account",async(req,res)=>{
// const {fullName,email,password} = req.body;
// if (!fullName || !email || !password){
//   return res
//   .status(400)
//   .json({error : true,message: "All fields are required"});
// }
// const isUser = await User.findOne({email});
// if(isUser){
//   return res
//   .status(400)
//   .json({error: true , message: "User already exist"})
// }
// const hashedPassword = await bcrypt.hash(password,10);

// const user = new User({
//   fullName,
//   email,
//   password : hashedPassword,
// });

// await user.save();

// const accessToken = jwt.sign(
//   {userId: user._id},
//   process.env.ACCESS_TOKEN_SECRET,{
//     expiresIn: "72h",
//   }
// );
// return res.status(201).json({
//   error: false,
//   users: {fullName: user.fullName,email: user.email},
//   accessToken,
//   message: "Registration Successful",
// });

// });

// //**Login account */
// app.post("/login",async(req,res) =>{
// const {email,password } = req.body;

// if(!email || !password){
//   return res.status(400).json({ message : "Email and Password are required"});
// }

// const user = await User.findOne({ email});
// if(!user){
//   return res.status(400).json({message : "User not found"});
// }

// const isPasswordValid = await bcrypt.compare(password,user.password);
// if(!isPasswordValid){
//   return res.status(400).json({message : "Ïnvalid Credentials"});
// }

// const accessToken = jwt.sign(
//   {userId : user._id},
//   process.env.ACCESS_TOKEN_SECRET,
//   {
//     expiresIn: "72h",
//   }
// );

// return res.json({
//   error : false,
//   message: "Login Successful",
//   user: {fullName: user.fullName,email:user.email},
//   accessToken,
// });

// });

// // ***********************GET USER**************
// app.get("/get-user", authenticateToken ,async (req,res)=>{
//   const {userId} = req.user
//   const isUser = await User.findOne({_id: userId});

//   //token invalid
//   if(!isUser){
//     return res.sendStatus(401);
//   }

//   return res.json({
//     user: isUser,
//     message : "",
//   });
// })

// // **********************************ADD TRAVEL STORY
// app.post("/add-travel-story", authenticateToken ,async (req,res)=>{
// const {title , story,visitedLocation,imageUrl,visitedDate} = req.body;
// const {userId} = req.user

// //Vaildate required fields
// if (!title || !story || !visitedLocation || !imageUrl || !visitedDate){
//   return res.status(400).json({error : true,message: "All fields are required"});
// }


// //Convert visiteddate from milliseconds to date object
// const parsedVisitedDate = new Date(parseInt(visitedDate));
// try{
//   const travelStory = new TravelStory({
//     title,
//     story,
//     visitedLocation,
//     userId,
//     imageUrl,
//     visitedDate: parsedVisitedDate,
//   });
//   await travelStory.save();
//   res.status(201).json({story: travelStory,message : 'Added Successfully'});

// }
// catch(error){
//   res.status(400).json({error:true,message:error.message});
// }
// })



// //*Get all travel story
// app.get("/get-all-stories", authenticateToken ,async (req,res)=>{
//   const { userId } = req.user;

//   try{
//     const travelStories = await TravelStory.find({userId: userId}).sort({
//       isFavourite: -1,
//     });
//     res.status(200).json({stories: travelStories});
//   }
//   catch(error){
//     res.status(500).json({error: true,message: error.message});
//   }
// });


// //*Route to handle image upload
// app.post("/image-upload", upload.single("image"),async (req,res)=>{
//   try{
//     if(!req.file){
//       return res
//       .status(400)
//       .json({error : true,message : "No image uploaded"});
//     }

//     const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

//     res.status(201).json({imageUrl});
//   }
//   catch(error){
//     res.status(500).json({error: true,message:error.message});
//   }
// });

// //*Serve static files from the uploads and assests directory
// app.use("/uploads",express.static(path.join(__dirname,"uploads")));
// app.use("/assets",express.static(path.join(__dirname, "assets")));

//DELETE A TRAVEL STORY  ************************888acc to databse
// app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.user;

//   try{
//     const travelStory = await TravelStoryCard.findOne({ _id: id,userId: userId});

//     if(!travelStory){
//       return res
//       .status(404)
//       .json({error: true,message: "travel story not found"});
//     }
//     //delete th travel story from the database
//     await travelStory.deleteOne({ _id: id,userId: userId});

//     //extract the filename from the imageurl
//     const imageUrl = travelStory.imageUrl;
//     const filename = path.basename(imageUrl);

//     //define the file path
//     const filePath = path.join(__dirname,'uploads',filename);

//     //delete the image file from uploads folder
//     fs.unlink(filePath,(err) =>{
//       if (err){
//         console.error("Failed to delete image file:",err);
//         //optionally ou could still respond with a success status here
//         //if u dont want to treat this as a critical error.
//       }
//     });
//     res.status(200).json({ message : "Travel story deleted successfully"});

//   }
//   catch(error){
//     res.status(500).json({error: true,message: error.message});
//   }
// })


//update is favourite in databse
// app.put("/update-is-favourite/:id", authenticateToken, (req, res) => {
//   const { id } = req.params;
//   const { isFavourite } = req.body;
//   const { userId } = req.user;

//   try{
//     const travelStory = await TravelStory.findOne({_id: id,userId: userId});

//     if(!travelStory){
//       return res.status(400).json({error: true,message: "Travel story not found"});

//     }
//     travelStory.isFavourite = isFavourite;

//     await travelStory.save();
//     res.status(200).json({ stor:travelStory,message: 'Update Successfull'});

//   }catch(error){
//   res.status(500).json({ error: true,message: error.message});
//   }

// })



// app.listen(8000);
// module.exports = app;



// //57:37