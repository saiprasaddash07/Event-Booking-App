import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email :
        {
            type:String,
            required:true
        },
    password :
        {
            type:String,
            required:true
        },
    createdEvents :
        [
            {
                type : mongoose.Schema.Types.ObjectID,
                ref: 'Event'
            }
        ]
});

const User = mongoose.model('User',userSchema);

export default User;