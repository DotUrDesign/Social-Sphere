import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // This will give us a way to send a user a web-token that they can use for authorization.
import User from "../models/User.js";  // setting up the model

/* Register User */
export const register = async (req, res) => {
    // This function is going to be asynchronous as we are making a call to mongo database. It's just like an API call from front-end to backend and from backend to database.
    // req -> what we are getting from the frontend
    // res -> what we will be sending to the frontend

    try {
        const {
            firstName,
            lastName, 
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        }  = req.body;  // destructuring all the parameters from the request body
        
        // It generates a salt using 'bcrypt.genSalt()' and then hashes the user's password using 'bcrypt.hash()'. This is a secure way to store passwords in the database, ensuring that the actual passwords are not stored in plain text.
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName, 
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        })
        // The newUser object is saved to the database using 'newUser.save()'. This typically corresponds to inserting a new user record into a DB table.
        const savedUser = await newUser.save();

        // It sends a JSON response with the saved user object.
        res.status(201).json(savedUser);
    } 
    catch (error) {
        res.status(500).json({error : err.message});
    }
};

/* Logging in */
export const login = async (req,res) => {
    try {
        
        const {email, password} = req.body;
        const user = await User.findOne({ email : email });  // Try to find the user which has that particular email and then return all the details of that user.

        // In case of incorrect email
        if(!user)
            return res.status(400).json({ msg : "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password); // checking whether the password entered by the user matches with the password present in the database. Basically, the hash is being compared here.

        // Incorrect password !!
        if(!isMatch)
            return res.status(400).json({ msg : "Invalid credentials"});


    

        const token = jwt.sign({ id : user.id} , process.env.JWT_SECRET);
        /*
        Here's a simpler breakdown of the code:

Creating the JWT: The code is creating this special key (JWT) for a user who just logged in.

Payload: Inside this key, there's some information. In your code, it's the user's ID. Imagine it's like putting a user's ID in a secret envelope.

Secret Key: To make sure this key is secure, it's locked with a secret key. Only your server knows this key, and it keeps it hidden.

The Result: The token variable holds this special key (JWT). You give this key to the user, usually as a response when they log in.

Using the Key: Later, when the user wants to access certain parts of your website, they show you this key (JWT). Your server can open it with the secret key and say, "Ah, this is the user with ID X."

So, it's like giving a secret key to a user that they can show you whenever they need to prove who they are without revealing their actual username and password. This helps with security and authentication in web applications.
        */


        delete user.password;  // delete the password so that it doesn't get sent back to the frontend.

        res.status(200).json({token, user});

    } catch (error) {
        res.status(500).json({ error : err.message});
    }
};
 