// temporary data
let notes = [
    { id:'0', content:'오늘은 출근을 했다.', author:'Janghyun'},
    { id:'1', content:'오늘은 운동을 했다.', author:'Yehna'},
    { id:'2', content:'오늘은 요리를 했다.', author:'Mandoo'},
];

const express = require('express');
const { ApolloServer, gql} = require('apollo-server-express');

const port = process.env.PORT || 4000;

const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Query {
        notes: [Note!]
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

const resolvers = {
    Query: {
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note=>note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let note = {
                id: String(notes.length),
                content: args.content,
                author: ''
            }
            notes.push(note);
            return note;
        }
    }
}

const app = express();

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
    console.log('GraphQL Server running on http://localhost:${port}${server.graphqlPath}')
);