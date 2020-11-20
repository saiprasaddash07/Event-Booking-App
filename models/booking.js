import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    event :
        {
            type:mongoose.Schema.Types.ObjectID,
            ref: 'Event'
        },
    user :
        {
            type : mongoose.Schema.Types.ObjectID,
            ref: 'User'
        }
},{
    timestamps: true
})

const Booking = mongoose.model('Booking',bookingSchema);

export default Booking;