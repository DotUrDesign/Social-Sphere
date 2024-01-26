import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName : {
            type: String,
            required : true
        },
        lastName: {
            type : String,
            reuqired : true
        },
        location : String,
        description: String,
        picturePath : String,
        userPicturePath : String,
        likes : {
            type : Map, // if you liked a post, then it will be added, else it will be removed.
            of: Boolean, // either you like a post or don't - true or false.
        },
        comments: {
            type : Array,
            default : []
        }
    },
    {timestamps : true}  // to keep a record of when(i.e., date and time) its being created or being updated.
);

const Post = mongoose.model("Post", postSchema);

export default Post;