import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import Generatetoken from "../utils/generateToken.js";


export const signup = async (req, res) => {
    try {
       
        const{username, email, password, role} = req.body;
        const user=await User.findOne({username})
        if(user){
            return res.status(400).json({error:"Username alredy exits"})
        }
        const salt= await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(password,salt)
        const newUser= new User({
            username,
            email,
            password:hashedpassword,
            role
        })
        if(newUser){
           Generatetoken(newUser._id,res);
           await newUser.save();
         //  console.log("Generated Token (Signup):", token); // Print token to console

           res.status(201).json({
               _id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                role:newUser.role,
                token:req.cookies.jwt
                
           })
         
   
       } else{
           return res.status(400).json({error:"Invalid user Data"})
       }

    } catch (error) {
        console.log("Error: ", error);
    }
}



export const login = async (req, res) => {
    const {username,password}=req.body;
       try {
        const user=await User.findOne({username});
        const ispasswordMatched= await bcrypt.compare(password,user?.password || ""); 
        if(!user || !ispasswordMatched){
            return res.status(400).json({error:"Invalid username or password"})
        }
        Generatetoken(user._id,res);
        res.status(200).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
            token:req.cookies.jwt
        })
       } catch (error) {
         console.log(error)
       }
}

    
export const logout= (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        console.log(error)
    }
}


export const getUsersForSideBar = async (req, res) => {
    try {
        console.log('[getUsersForSideBar] Started processing request');
        console.log('[getUsersForSideBar] Request user:', req.user);
        
        const loggedInUser = req.user._id;
        console.log('[getUsersForSideBar] Logged in user ID:', loggedInUser);
        
        console.log('[getUsersForSideBar] Querying database for users...');
        const allusers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        
        console.log('[getUsersForSideBar] Found users count:', allusers.length);
        console.log('[getUsersForSideBar] First user sample:', allusers[0] || 'No users found');
        
        res.status(200).json(allusers);
        console.log('[getUsersForSideBar] Response sent successfully');
    } catch (error) {
        console.error('[getUsersForSideBar] ERROR:', error);
        console.error('[getUsersForSideBar] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Always send a response to the client
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getCurrentUser = async (req, res) =>{
    try {
       const loggedInUser = req.body.userId;

       const CurrUser=await User.findOne({ _id:  loggedInUser  }).select("-password"); //find all the users expect that equal to the thaat user id which loggeid in user
       
       res.status(200).json(CurrUser);
       
    } catch (error) {

       console.log(error);
    }
}

// New function to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!username && !email) {
            return res.status(400).json({ error: "At least one field (username or email) is required" });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if new username is already taken
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ error: "Username already taken" });
            }
            user.username = username;
        }

        // Check if new email is already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: "Email already in use" });
            }
            user.email = email;
        }

        // Save updated user
        await user.save();

        // Return updated user data (excluding password)
        const updatedUser = await User.findById(userId)
            .select("-password")
            .populate('registeredEvents')
            .populate('createdEvents');

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Error in updateProfile: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}