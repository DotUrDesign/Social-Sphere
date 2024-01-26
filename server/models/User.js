import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        // Validation checks...
        firstName:{
            type: String,
            required:true,
            min: 2,
            max:50,
        },
        lastName:{
            type: String,
            required:true,
            min: 2,
            max:50,
        },
        email:{
            type: String,
            required:true,
            max:50,
            unique: true,
        },
        password:{
            type: String,
            required:true,
            min: 5,
        },
        picturePath:{
            type: String,
            default: "",
        },
        friends:{
            type: Array,
            default: []
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    },
    {timestamps: true}  // this would give us when it's created and when it's updated. just for the sake of conviniency.
);

const User = mongoose.model("User", UserSchema);
export default User;