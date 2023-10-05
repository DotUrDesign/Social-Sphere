import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import {register } from "./controllers/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost} from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* Configurations --> This will include all the middleware configurations and different package configurations => Middleware is basically something that runs in b/w diff requests. */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* File storage */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register); 
/*
"/auth/register" -> route we are gonna hit
"upload.single("picture")" -> middleware
register -> actual logic -> this function is generally called "controller".

SO, whats happening here is that when we hit the route, then the middleware i.e., the function upload.single is called and it uploads the picture in the "public/assets" and then the actual logic is implemented i.e., "register".
*/

app.post("/posts", verifyToken, upload.single("picture"), createPost);
/*
So, in simple terms, this line of code is saying that when a POST request is made to the "/posts" URL, first, check if the user has a valid token (authentication), then process any uploaded image (if there is one), and finally, create a new post based on the data provided in the request.

In this line of code, we have two middlewares - verifyToken , upload.single("picture").
*/

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* Mongoose setup */
const PORT = process.env.PORT || 6001;
mongoose.connect (process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // Add this data one time...just save it once and then comment it...
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect`));
