import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import {buildSchema} from 'graphql';
import connectDB from './db/mongoose.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();

const events = [];

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
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput) : Event
        }
    
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue : { // resolvers
        events: ()=>{
            return events;
        },
        createEvent : (args) => {
            const event = {
                _id : Math.random().toString(),
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql : true
}));

app.listen(3000,()=>{
    console.log('App is listening on port 3000');
});