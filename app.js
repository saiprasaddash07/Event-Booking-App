import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import {buildSchema} from 'graphql';
import connectDB from './db/mongoose.js';
import dotenv from 'dotenv';
import Event from './models/events.js';
import User from './models/user.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHttp.graphqlHTTP({
    schema : buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput) : Event
            createUser(userInput: UserInput) : User
        }
    
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue : { // resolvers
        events: ()=>{
            return Event.find().then(events=>{
                return events.map(event=>{
                    return { ...event._doc , _id: event.id };
                })
            }).catch(err=>{
                console.log(err);
                throw err;
            });
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
                return { ...result._doc , _id: result._doc._id.toString() };
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
                return {...result._doc, password:null,  _id: result.id};
            }catch (e) {
                console.log(e);
                throw e;
            }
        }
    },
    graphiql : true
}));

app.listen(3000,()=>{
    console.log('App is listening on port 3000');
});