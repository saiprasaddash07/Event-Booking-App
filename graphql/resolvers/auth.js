import User from '../../models/user.js';
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
}