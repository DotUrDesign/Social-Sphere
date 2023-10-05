import Post from "../models/Post.js";
import Posts from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async(req, res) => {
    try {
        
        const { userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName : user.firstName,
            lastName : user.lastName,
            location: user.location,
            description,
            userPicturePath : user.picturePath,
            picturePath,
            likes: {},  // the likes will be an empty object coz every post starts with 0 likes.
            comments : [],
        })

        await newPost.save();

        const post = await Post.find();

        res.status(201).json(post);

    } 
    catch (error) {
        res.status(409).json({ message : err.message});
    }
}


/* READ */
export const getFeedPosts = async(req, res) => {
    try {

        const post = await Post.find();

        res.status(200).json(post);

    } 
    catch (error) {
        res.status(404).json({ message : err.message});
    }
}


export const getUserPosts = async(req, res) => {
    try {

        const { userId } = req.params;
        
        const post = await Post.find({userId});

        res.status(200).json(post);

    } 
    catch (error) {
        res.status(404).json({ message : err.message});
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked)
        {
            // if the post is liked, then remove it from the list of liked posts.
            post.likes.delete(userId);
        }
        else{
            // else add it to the list of liked posts.
            post.likes.set(userId, true);
        }

        // basically after the above logic, we have to update the post likes and send it to the frontend.
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes : post.likes },
            { new : true }
        );
 
        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(404).json({ message : err.message})
    }
}