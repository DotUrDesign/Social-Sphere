import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // So, what's happening here is that since we created a particular route of "/users" in the index.js , this route gonna be "/users/:id" .                The syntax   "/:id" represents if the front-end is sending a particular userId  over here, we can grab this id and call our database with that particular id. This is how we do "query strings".

router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId" , verifyToken, addRemoveFriend);

export default router;