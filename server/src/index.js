const express = require('express');
const { ApolloServer, gql} = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const models = require('./models');

// Configuration
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;


// Schema
const typeDefs = gql`
    type Note {
        id: ID!
        content: String
        author: String
    }
    type Query {
        notes: [Note]
        note(id: ID): Note
    }
    type Mutation {
        newNote(content: String!): Note
    }
`;

const resolvers = {
    Query: {
        notes: async() => {
            return await models.Note.find();
        },
        note: async (parent, args) => {
            return models.Note.findById(args.id);
        }
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: "abc"
            })
        }
    }
}


// App running
const app = express();
db.connect(DB_HOST);

let server = null;
async function startServer() {
    server = new ApolloServer({
        typeDefs,
        resolvers,
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