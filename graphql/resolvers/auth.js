import User from '../../models/user.js';
import jwt from 'jsonwebtoken';

import bcrypt from "bcryptjs";

export default {
    createUser : async (args) => {
        try{
            const userExist = await User.findOne({email:args.userInput.email});
            if(userExist){
                return new Error('User exists already here!');
            }
            const hashedPassword =  await bcrypt.hash(args.userInput.password,12)
            const user = new User({
                email : args.userInput.email,
                password : hashedPassword
            });
            const result =  await user.save();
            return {
                ...result._doc,
                password:null,
                _id: result.id
            };
        }catch (e) {
            console.log(e);
            throw e;
        }
    },
    login: async ({email,password}) => {
        const user = await User.findOne({email});
        if(!user){
            throw new Error('User does not exist');
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if(!isEqual){
            throw new Error('Password is not correct!');
        }
        const token = jwt.sign({userId:user.id,email:user.email},process.env.JWT_SECRET,{
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}