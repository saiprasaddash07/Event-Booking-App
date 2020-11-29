import Booking from '../../models/booking.js';
import Event from '../../models/events.js';

import mergeFunctions from './merge.js';

export default {
    bookings: async (args,req) =>{
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try{
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                return mergeFunctions.transformBooking(booking);
            })
        }catch (e) {
            throw e;
        }
    },
    bookEvent: async(args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        const fetchedEvent = await Event.findOne({_id:args.eventId});
        const booking = new Booking({
            user : '5fb6d249f93dc70b0c8b3a42',
            event: fetchedEvent
        })
        const result = await booking.save();
        return mergeFunctions.transformBooking(result);
    },
    cancelBooking: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = mergeFunctions.transformedEvent(booking.event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }catch(e){
            throw e;
        }
    }
}