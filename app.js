import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import connectDB from './db/mongoose.js';
import dotenv from 'dotenv';
import graphqlSchema from './graphql/schema/index.js';
import graphqlResolvers from './graphql/resolvers/index.js';
import isAuth from './middleware/isAuth.js';

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method==='OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

app.use('/graphql',graphqlHttp.graphqlHTTP({
    schema :graphqlSchema,
    rootValue : graphqlResolvers,
    graphiql : true
}));

app.listen(5000,()=>{
    console.log('App is listening on port 5000');
});