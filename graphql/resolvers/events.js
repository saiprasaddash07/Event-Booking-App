import Event from '../../models/events.js';
import User from "../../models/user.js";
import mergeFunctions from './merge.js';

export default { // resolvers
    events: async () => {
        try{
            const events = await Event.find();
            return events.map(event=>{
                return mergeFunctions.transformedEvent(event);
            });
        }catch (e) {
            throw e;
        }
    },
    createEvent : async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try{
            const event = new Event({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(args.eventInput.date),
                creator: req.userId
            });
            const result = await event.save();
            const user = await User.findById(req.userId);
            if(!user){
                return new Error('User exists already here!');
            }
            user.createdEvents.push(event);
            await user.save();
            return mergeFunctions.transformedEvent(result);
        }catch (err) {
            console.log(err);
            throw err;
        }
    },
}