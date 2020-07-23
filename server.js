require('dotenv').config();
// assigned this function to the variable express
const express = require('express');
const cookieParser = require('cookie-parser');

const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');

// const fs = require('fs');

// const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';
const port = process.env.API_SERVER_PORT || 3000;

// A scalar type resolver needs to be an object of the class GraphQLScalarType
// const { GraphQLScalarType } = require('graphql');
// The kind property indicates the type of the token that the parser found
// const { Kind } = require('graphql/language');
// const { MongoClient } = require('mongodb');

// store the connection to the database in a global variable
// const url = 'mongodb://localhost/issuetracker';
// let db; // global variable

// create the middleware, public is directory
// const fileServerMiddleware = express.static('public');
// app.use('/', fileServerMiddleware);  // mount middleware on the application

// app.use('/public',express.static('public'));

// initialize GraphQL server, construct Apollo server object
// the constructor return a Graph server object
// const { ApolloServer, UserInputError } = require('apollo-server-express');

// let aboutMessage = 'Issue Tracker API v1.0';
// const issuesDB = [
//     {
//         id: 1, status: 'New', owner: 'Ravan', effort: 5,
//         created: new Date('2018-08-15'), due: undefined,
//         title: 'Error in console when clicking Add',
//     },
//     {
//         id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
//         created: new Date('2018-08-16'), due: new Date('2018-08-30'),
//         title: 'Missing bottom border on panel',
//     }
// ];

// A scalar type resolver needs to be an object of the class GraphQLScalarType
// The constructor of GraphQLScalarType takes an object with various properties
// create resolver
// const GraphQLDate = new GraphQLScalarType({
//   name: 'GraphQLDate',
//   description: 'A Date() type in GraphQL as a scalar',
//   serialize(value) {
//     return value.toISOString();
//   },
//   parseValue(value) {
//     const dateValue = new Date(value);
//     // return isNaN(dateValue) ? undefined : dateValue;
//     return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
//   },
//   // the argument ast contains a kind property as well as a value property.
//   parseLiteral(ast) {
//     if (ast.kind === Kind.STRING) {
//       const value = new Date(ast.value);
//       return Number.isNaN(value.getTime()) ? undefined : value;
//     }
//     return undefined;
//   },
// });


// define the schema of the API
// about is field name, Query is type name
// use the variable typeDefs that contains the schema when we initialize the server
// input values are specified just like in function calls
// use a string data type as the return value for the setAboutMessage field
// setAboutMessage is a field

// function setAboutMessage(_, { message }) {
//   aboutMessage = message;
//   return aboutMessage;
// }

// async function issueList() {
//   // return issuesDB;
//   const issues = await db.collection('issues').find({}).toArray();
//   return issues;
// }

// async function connectToDb() {
//   const client = new MongoClient(url, { useNewUrlParser: true });
//   await client.connect();
//   console.log('Connected to MongoDB at', url);
//   db = client.db();
// }

// async function getNextSequence(name) {
//   const result = await db.collection('counters').findOneAndUpdate(
//     { _id: name },
//     { $inc: { current: 1 } },
//     { returnOriginal: false },
//   );
//   return result.value.current;
// }

// function issueValidate(issue) {
//   const errors = [];
//   if (issue.title.length < 3) {
//     errors.push('Field "title" must be at least 3 characters long.');
//   }
//   if (issue.status === 'Assigned' && !issue.owner) {
//     errors.push('Field "owner" is required when status is "Assigned".');
//   }
//   if (errors.length > 0) {
//     throw new UserInputError('Invalid input(s)', { errors });
//   }
// }

// async function issueAdd(_, { issue }) {
//   issueValidate(issue);
//   const newIssue = Object.assign({}, issue);
//   newIssue.created = new Date();
//   // issue.id = issuesDB.length + 1;
//   newIssue.id = await getNextSequence('issues');
//   // if (issue.status == undefined) issue.status = 'New';
//   // issuesDB.push(issue);
//   const result = await db.collection('issues').insertOne(newIssue);

//   // return issue;
//   const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
//   return savedIssue;
// }

// // define handlers or functions that can be called when the above fields are accessed
// const resolvers = {
//   Query: {
//     // about: () => aboutMessage,
//     about: about.getMessage,
//     issueList,
//   },
//   Mutation: {
//     // setAboutMessage,
//     setAboutMessage: about.setMessage,
//     issueAdd,
//   },
//   GraphQLDate,
// };

// const server = new ApolloServer({
//   typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
//   resolvers,
//   formatError: (error) => {
//     console.log(error);
//     return error;
//   },
// });

const auth = require('./auth.js');

const app = express(); // instantiate an Express application which is web server
// that listens on a specific IP address and port
// app.use(express.static('public'));

app.use(cookieParser());
app.use('/auth', auth.routes);

installHandler(app);

// const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
// console.log('CORS setting:', enableCors);

// install the middleware in the Express application
// server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

// change the setup of the server to first connect to the database and
// then start the Express application
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());

// app.listen(3000, function() {
//     console.log('App started on port 3000');
// });  // start the server and let it serve HTTP requests
