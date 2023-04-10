import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
import helmet from "helmet"; // Helmet helps you secure your Express apps by setting various HTTP headers. (Request Safety)
import morgan from "morgan"; // Morgan is a Node. js and Express middleware to log HTTP requests and errors.
import path from "path";
import { fileURLToPath } from "url"; //  fileURLToPath function decodes the file URL to a path string
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import { verifyToken } from "./middleware/auth.js";

// // For adding dummyData
// import User from "./models/user.js";
// import Post from "./models/Posts.js";
// import { users, posts } from "./dummyData/data.js";

////////// CONFIGURATIONS //////////

const __filename = fileURLToPath(import.meta.url); // import.meta.url contains the absolute URL
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// Express applications that use the body-parser middleware have a default limit to the request body size that the application will handle.
// This default limit is 100kb. So, if your application receives a request with a body that exceeds this limit, the application will throw a “Error: Request entity too large”.
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

// express.static() => To serve static files such as images, CSS files, and JavaScript files
// Here we are setting the directory where we are gonna keep our assets like images,etc. In real life projects we should store it in cloud like S3, here we are gonna store it locally.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

////////// FILE STORAGE //////////
{
  /*Multer has an in-built method called "diskStorage" and it takes a couple of options.

The destination option is a callback function that takes three arguments:
req, which is the incoming request object.
file, which is the incoming file object.
cb, which is again another callback function. 
We call the cb function that takes the two arguments. The first is error which we are going to pass null to. The second is the destination folder

The second option that this method takes is the "filename". It is almost the same as the destination option except in this, the inner callback function takes the filename as the second argument.
filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
*/
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const upload = multer({ storage: storage }) => while uploading any file we are gonna use this variable.
const upload = multer({ storage });

////////// ROUTES WITH FILES //////////

// Authentication & Authorization => Authentication is when user is registered and logged in, Authorization is when we wanna make sure that someone is logged in so that that purticular user can perform certian actions.

app.post("/auth/register", upload.single("picture"), register); // picture => property that we have set where the img is located in the http call
app.post("/posts", verifyToken, upload.single("picture", createPost));

////////// ROUTES //////////

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

////////// MONGOOSE SETUP //////////

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running On Port : ${PORT}`);
    });

    // // For adding dummyData
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.log(`Error while connecting : ${err}`);
  });
