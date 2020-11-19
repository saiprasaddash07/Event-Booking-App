import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    title :
        {
            type:String,
            required:true
        },
    description :
        {
            type:String,
            required:true
        },
    price :
        {
            type: Number,
            required: true
        },
    date :
        {
            type: Date,
            required: true
        },
    creator :
        {
            type : mongoose.Schema.Types.ObjectID,
            ref: 'User'
        }
},{
    timeStamps: true
})

const Event = mongoose.model('Event',eventSchema);

export default Event;