const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const { ApolloServer, gql} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Data schema
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');


// Configuration
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// App running
const app = express();
app.use(helmet());
app.use(cors());
db.connect(DB_HOST);

const getUser = (token) => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            throw new Error('Session invalid');
        }
    }
}
let server = null;
async function startServer() {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
        context: ({req}) => {
            const token = req.headers.authorization;
            const user = getUser(token);
            return {models, user};
        },
        introspection: true,
        playground: true,
    });
    await server.start();
    server.applyMiddleware({ app, path:'/api' });
}
startServer();


app.listen( { port }, () => 
    console.log('GraphQL Server running on http://localhost:'+port+server.graphqlPath)
);