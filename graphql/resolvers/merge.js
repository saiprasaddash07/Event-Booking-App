import User from "../../models/user.js";
import Event from "../../models/events.js";
import DateFunction from "../../helpers/date.js";

const transformedEvent = (event) =>{
    return {
        ...event._doc ,
        _id: event.id ,
        date: new Date(event._doc.date).toISOString(),
        creator: userData.bind(this,event._doc.creator)
    };
}

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user : userData.bind(this,booking._doc.user),
        event : singleEvent.bind(this,booking._doc.event),
        createdAt: DateFunction.dateToString(booking._doc.createdAt),
        updatedAt: DateFunction.dateToString(booking._doc.updatedAt),
    };
}

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
            return transformedEvent(event);
        })
    }catch (e) {
        throw e;
    }
}

const singleEvent = async (eventId) => {
    try{
        const event = await Event.findById(eventId);
        return transformedEvent(event);
    }catch (e){
        throw e;
    }
}

export default {
    transformedEvent,
    transformBooking
}