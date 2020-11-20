import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import connectDB from './db/mongoose.js';
import dotenv from 'dotenv';
import Event from './models/events.js';
import User from './models/user.js';

import graphqlSchema from './graphql/schema/index.js';
import graphqlResolvers from './graphql/resolvers/index.js';

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHttp.graphqlHTTP({
    schema :graphqlSchema,
    rootValue : graphqlResolvers,
    graphiql : true
}));

app.listen(3000,()=>{
    console.log('App is listening on port 3000');
});