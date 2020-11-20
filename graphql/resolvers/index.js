import Event from '../../models/events.js';
import User from '../../models/user.js';
import bcrypt from "bcryptjs";

const userData = async (userId) => {
    try{
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id:user.id,
            createdEvents: eventsIds.bind(this,user._doc.createdEvents)
        };
    }catch (e) {
        throw e;
    }
}

const eventsIds = async (eventIdz) => {
    try{
        const events = await Event.find({_id:{$in : eventIdz}});
        return events.map(event => {
            return {
                ...event._doc,
                _id:event.id,
                date: new Date(event._doc.date).toISOString(),
                creator : userData.bind(this,event.creator)
            };
        })
    }catch (e) {
        throw e;
    }
}

export default { // resolvers
    events: async () => {
        try{
            const events = await Event.find();
            return events.map(event=>{
                return {
                    ...event._doc ,
                    _id: event.id ,
                    date: new Date(event._doc.date).toISOString(),
                    creator: userData.bind(this,event._doc.creator)
                };
            });
        }catch (e) {
            throw e;
        }
    },
    createEvent : async (args) => {
        try{
            const event = new Event({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(args.eventInput.date),
                creator: '5fb6d249f93dc70b0c8b3a42'
            });
            const result = await event.save();
            const user = await User.findById('5fb6d249f93dc70b0c8b3a42');
            if(!user){
                return new Error('User exists already here!');
            }
            user.createdEvents.push(event);
            await user.save();
            return {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: userData.bind(this,result._doc.creator)
            };
        }catch (err) {
            console.log(err);
            throw err;
        }
    },
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
    }
}