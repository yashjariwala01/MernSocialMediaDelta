import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const register = async (req,res)=>{

    try{
        const { firstName,
                lastName,
                email,
                password,
                picturePath,
                friends,
                location,
                occupation
                } = req.body;

        // const salt = bcryptjs.genSalt(12);
        const salt = 12;
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const login = async(req,res)=>{
try{
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user) return res.status(400).json({msg:'invalid user, please register. '})

    const isPasswordMatched = bcryptjs.compare(password, user.password);
    if(!isPasswordMatched) return res.status(400).json({msg:'invalid credentials. '})

    const token = jwt.sign({id: user._id}, 'JWT_SECRET');
    delete user.password;

    res.status(200).json({token,user})
}catch(err){
    res.status(500).json({error :err.message})
}
}