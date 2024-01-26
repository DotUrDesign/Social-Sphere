import User from "../models/User.js";

/* READ */
export const getUser = async(req, res) => {
    try {

        const {id} = req.params;   // whatever request is sent by the frontend, destructure the id from that request.
        const user = await User.findById(id);  // fetching the details of the user by id.
        res.status(200).json(user); // returning the details of the user to the frontend.

    } catch (error) {
        res.status(404).json({message : err.message});
    }
}

export const getUserFriends = async (req, res) => {

    try {
        const {id} = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
    
        // formating the schema before returning it to the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath}) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
    
        res.status(200).json(formattedFriends);
        
    } catch (error) {
        res.status(404).json({message : err.message});
    }
    
};


/* UPDATE */
export const addRemoveFriend = async(req, res) => {
    try {
        
        const {id , friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // important logic starts from here...

        // if the friendId is already included in the main user's friend's id, we want it to be removed.
        if(user.friends.includes(friendId)) 
        {
            // basically we are filtering out the ids which are equal to friendId and rest are being included to the user's friends list.
            user.friend = user.friends.filter((id) => id !== friendId);

            // we are also removing the user's id from the friend's friends.
            friend.friends = friend.friends.filter((id) => id !== id);
        }

        // if they are not included, then include the friend to the user's id and the user to the friend's id.
        else
        {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        // then we want the user's list to be formatted and passed it to the frontend. I am copying this from the "getUserFriends" function.
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
    
        // formating the schema before returning it to the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath}) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends); // sending the result to the frontend along with the status code.

    } catch (error) {
        res.status(404).json({ message : err.message});
    }
}